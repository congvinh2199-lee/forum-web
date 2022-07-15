const asyncHandler = require("express-async-handler");
const { questionMiddleware } = require("../middlewares/question");
const { SEND_MAIL } = require("../middlewares/sendMail");
const {
  createQuestion,
  createQuestionVideo,
  getAllQuestion,
  changeQuestionStatus,
  deleteQuestion,
  getQuestionPollById,
  createQuestionAnswer,
  getAllQuestionAnswer,
  deleteUserQuestionPoll,
  changeQuestionView,
  getQuestionByUserId,
  addAnswerChild,
  getChildAnswer,
  getQuestionAnswerFavourite,
  getQuestionAnswerMark,
  countAllQuestionAnswer,
  countTotalQuestion,
  totalQuestionByUserId,
  findUserFromQuestionId,
  deleteQuestionAnswer,
  changeQuestionCommentDisabled,
} = require("../model/question");
const { WEB_DOMAIN } = require("../utils/constant");
const { dateTimeConverter } = require("../utils/utils");

module.exports = {
  createNewQuestion: asyncHandler(async (req, res) => {
    const { questionData } = req.body;
    const {
      tag,
      consultQuestion,
      consultCheck,
      addVideoCheck,
      sendmailAnswerCheck,
      incognitoCheck,
      questionInfo,
      user_id,
    } = questionData;

    const createQuestionRes = await createQuestion(
      questionInfo,
      consultCheck,
      addVideoCheck,
      sendmailAnswerCheck,
      incognitoCheck,
      user_id
    );

    if (!createQuestionRes?.success)
      return res.send({ success: false, error: "Đăng câu hỏi thất bại" });

    if (tag?.length) {
      await questionMiddleware.createQuestionTag(
        tag,
        createQuestionRes?.payload // question_id
      );
    }

    if (
      addVideoCheck &&
      (questionInfo?.question_video?.video_type?.length ||
        questionInfo?.question_video?.video_id?.length)
    ) {
      await createQuestionVideo(
        createQuestionRes?.payload,
        questionInfo?.question_video?.video_type,
        questionInfo?.question_video?.video_id
      );
    }

    if (consultCheck && consultQuestion?.length) {
      await questionMiddleware.createQuestionPoll(
        consultQuestion,
        createQuestionRes?.payload
      );
    }

    return res.send({ success: true });
  }),

  getAllQuestion: asyncHandler(async (req, res) => {
    const { limit, offset, getPoll, sort, search, topic, poll } = req.query;
    const listQuestion = await getAllQuestion(
      limit,
      offset,
      sort,
      search,
      topic,
      poll
    );
    const totalQuestion = await countTotalQuestion(sort, search, topic, poll)

    if (getPoll) {
      for (let i = 0; i < listQuestion?.length; i++) {
        const polls = await getQuestionPollById(listQuestion[i]?.question_id);
        listQuestion[i].poll = [...polls];
      }
    }
    return res.send({ success: true, payload: {question: listQuestion, total: totalQuestion} });
  }),

  getQuestionByUserId: asyncHandler(async (req, res) => {
    const { userId } = req?.params;
    const { limit, offset } = req?.query;

    const listQuestion = await getQuestionByUserId(userId, limit, offset);
    const total = await totalQuestionByUserId(userId)

    for (let i = 0; i < listQuestion?.length; i++) {
      const polls = await getQuestionPollById(listQuestion[i]?.question_id);
      listQuestion[i].poll = [...polls];
    }
    return res.send({ success: true, payload: {question: listQuestion, total} });
  }),

  changeQuestionStatus: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { status } = req.body;

    const changeRes = await changeQuestionStatus(questionId, status);
    if (changeRes) return res.send({ success: true });
    return res.send({ success: false, error: "Cập nhật trạng thái thất bại" });
  }),

  deleteQuestion: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const deleteRes = await deleteQuestion(questionId);
    if (deleteRes) return res.send({ success: true });
    return res.send({ success: false, error: "Xoá câu hỏi thất bại" });
  }),

  getQuestionDetail: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const questionDetail = await questionMiddleware.getQuestionDetail(
      questionId
    );

    return res.send({ success: true, payload: questionDetail });
  }),

  createQuestionAnswer: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { questionData } = req.body;
    const { userId, answerText, incognitoCheck } = questionData;
    const createRes = await createQuestionAnswer(
      questionId,
      userId,
      answerText,
      incognitoCheck
    );
    if (createRes){
      const user = await findUserFromQuestionId(questionId)
      if ( user?.email ){
        const sendMail = user?.sendmail_answer
        if ( sendMail ){
          
          await SEND_MAIL(user?.email, dateTimeConverter(user?.created_day), `${WEB_DOMAIN}/question/${questionId}`)
        }
      }
    }
    return res.send({ success: createRes });
  }),

  getAllQuestionAnswer: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { limit, offset } = req.query;
    const listAnswer = await getAllQuestionAnswer(questionId, limit, offset);
    const totalAnswer = await countAllQuestionAnswer(questionId)
    const listFullAnswer = [];

    for (let child of listAnswer) {
      const answer = { ...child };
      const childAnswer = await getChildAnswer(child?.answer_id);
      const answerFavourite = await getQuestionAnswerFavourite(
        child?.answer_id
      );
      const answerMark = await getQuestionAnswerMark(child?.answer_id);

      if (answerFavourite?.length) {
        answer.favourite = [...answerFavourite]?.map((item) => item?.user_id);
      }
      if (childAnswer?.length) {
        answer.childAnswer = [...childAnswer];
      }
      answer.mark = answerMark?.[0] || {}

      listFullAnswer?.push({ ...answer });
    }
    return res.send({ success: true, payload: {answer: [...listFullAnswer], total: totalAnswer} });
  }),

  voteQuestionPoll: asyncHandler(async (req, res) => {
    const { questionPollId } = req.params;
    const { userId } = req.body;

    const voteRes = await questionMiddleware.voteQuestionPoll(
      questionPollId,
      userId
    );
    return res.send(voteRes);
  }),

  deleteQuestionPoll: asyncHandler(async (req, res) => {
    const { questionPollId } = req.params;
    const { userId } = req.query;
    const deleteRes = await deleteUserQuestionPoll(questionPollId, userId);
    return res.send({ success: deleteRes });
  }),

  changeQuestionView: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { view } = req.query;
    const questionView = await changeQuestionView(questionId, view);
    return res.send({ success: questionView });
  }),

  addAnswerChild: asyncHandler(async (req, res) => {
    const { answerId, userId, comment } = req.body;
    const addRes = await addAnswerChild(answerId, userId, comment);
    return res.send({ success: addRes });
  }),

  changeUserAnswerFavourite: asyncHandler(async (req, res) => {
    const { answerId, type, userId } = req.body;
    const changeRes = await questionMiddleware.changeUserAnswerFavourite(
      answerId,
      type,
      userId
    );
    return res.send(changeRes);
  }),

  markUserQuestionScore: asyncHandler(async (req, res) => {
    const { questionId, userId, currentStar } = req.body;
    const markRes = await questionMiddleware.markUserQuestionScore(
      questionId,
      userId,
      currentStar
    );
    return res.send(markRes);
  }),

  markUserAnswerScore: asyncHandler(async (req, res) => {
    const { answerId, userId, currentStar } = req.body;
    const markRes = await questionMiddleware.markUserAnswerScore(
      answerId,
      userId,
      currentStar
    );
    return res.send(markRes);

  }),

  deleteQuestionAnswer: asyncHandler(async (req, res) => {
    const {answerId} = req?.params
    const deleteRes = await deleteQuestionAnswer(answerId)
    return res.send({ success: deleteRes });
  }),

  changeQuestionCommentDisabled: asyncHandler(async (req, res) => {
    const {questionId} = req?.params
    const {disabled} = req?.body
    const disabledRes = await changeQuestionCommentDisabled(questionId, disabled)
    return res.send({ success: disabledRes });
  })
};
