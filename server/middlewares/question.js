const {
  createQuestionPoll,
  getQuestionById,
  getQuestionTagById,
  getQuestionPollById,
  findUserQuestionPoll,
  deleteUserQuestionPoll,
  insertUserQuestionPoll,
  getUserChoosePoll,
  deleteUserAnswerFavourite,
  insertUserAnswerFavourite,
  getUserQuestionMark,
  updateUserQuestionMark,
  insertUserQuestionMark,
  getUserAnswerMark,
  updateUserAnswerMark,
  insertUserAnswerMark,
  getQuestionFavourite,
  getQuestionMark,
} = require("../model/question");
const { getTagByName, createTag, createQuestionTag } = require("../model/tag");
const { updateUserScore, getUserById } = require("../model/user");

module.exports.questionMiddleware = {
  createQuestionTag: async (tags, questionId) => {
    for (let i = 0; i < tags?.length; i++) {
      let tag_id = "";
      const tagResult = await getTagByName(tags[i]);
      if (!tagResult?.payload?.tag_id) {
        const createTagRes = await createTag(tags[i]);
        tag_id = createTagRes?.payload;
      } else {
        tag_id = tagResult?.payload?.tag_id;
      }
      await createQuestionTag(tag_id, questionId);
    }
  },

  createQuestionPoll: async (listPoll, questionId) => {
    for (let i = 0; i < listPoll?.length; i++) {
      await createQuestionPoll(listPoll[i], questionId);
    }
  },

  getQuestionDetail: async (questionId) => {
    const questionInfo = await getQuestionById(questionId);
    const questionTag = await getQuestionTagById(questionId);
    const questionMark = await getQuestionMark(questionId)
    let poll = [];
    if (questionInfo?.poll_question) {
      const questionPoll = await getQuestionPollById(questionId);
      if (questionPoll?.length) {
        poll = [...questionPoll];
        for (let i = 0; i < poll.length; i++) {
          const userChoosePoll = await getUserChoosePoll(
            poll[i].question_poll_id
          );
          poll[i].userChoosePoll = [...userChoosePoll];
        }
      }
    }

    return {
      question: {
        ...questionInfo,
        tag: [...questionTag],
        poll: [...poll],
        mark: questionMark?.[0] || {},
      },
    };
  },

  voteQuestionPoll: async (questionPollId, userId) => {
    const findPoll = await findUserQuestionPoll(questionPollId, userId);

    if (!findPoll?.question_poll_id) {
      const insertRes = await insertUserQuestionPoll(questionPollId, userId);
      if (!insertRes) {
        return {
          success: false,
          error: "Đã xảy ra vấn đề trong quá trình xử lí thông tin",
        };
      }
    }
    return { success: true };
  },

  changeUserAnswerFavourite: async (answerId, type, userId) => {
    if (type === "remove") {
      const deleteRes = await deleteUserAnswerFavourite(answerId, userId);
      return { success: deleteRes };
    }

    if (type === "add") {
      const addRes = await insertUserAnswerFavourite(answerId, userId);
      return { success: addRes };
    }
  },

  markUserQuestionScore: async (questionId, userId, currentStar) => {
    const checkUserMarkExist = await getUserQuestionMark(questionId, userId);
    const userInfo = await getUserById(userId)

    if (checkUserMarkExist?.question_id) {
      const updateRes = await updateUserQuestionMark(
        questionId,
        userId,
        currentStar
      );
      if ( Number(checkUserMarkExist?.score) === 5 &&  currentStar < 5 ){
        const updateScoreRes = await updateUserScore(userId, userInfo?.score - 1)
      }

      if ( Number(checkUserMarkExist?.score) < 5 && currentStar === 5 ){
        const updateScoreRes = await updateUserScore(userId, userInfo?.score + 1)
      }

      return { success: updateRes };

    } else {
      const insertRes = await insertUserQuestionMark(
        questionId,
        userId,
        currentStar
      );

      if ( currentStar === 5 ){
        const updateScoreRes = await updateUserScore(userId, userInfo?.score + 1)
      }
      return { success: insertRes };
    }
  },

  markUserAnswerScore: async (answerId, userId, currentStar) => {
    const checkUserMarkExist = await getUserAnswerMark(answerId, userId);
    const userInfo = await getUserById(userId)

    if (checkUserMarkExist?.answer_id) {
      const updateRes = await updateUserAnswerMark(
        answerId,
        userId,
        currentStar
      );

      if ( Number(checkUserMarkExist?.score) === 5 &&  currentStar < 5 ){
        const updateScoreRes = await updateUserScore(userId, userInfo?.score - 1)
      }

      if ( Number(checkUserMarkExist?.score) < 5 && currentStar === 5 ){
        const updateScoreRes = await updateUserScore(userId, userInfo?.score + 1)
      }

      return { success: updateRes };
    } else {
      const insertRes = await insertUserAnswerMark(
        answerId,
        userId,
        currentStar
      );
      if ( currentStar === 5 ){
        const updateScoreRes = await updateUserScore(userId, userInfo?.score + 1)
      }
      return { success: insertRes };
    }
  },
};
