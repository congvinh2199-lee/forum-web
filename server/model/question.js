const { postgresql } = require("../config/connect");
const { QUESTION_SORT } = require("../utils/constant");
const { getByLimitAndOffset } = require("../utils/utils");

module.exports = {
  createQuestion: async (
    questionInfo,
    consultCheck,
    addVideoCheck,
    sendmailAnswerCheck,
    incognitoCheck,
    user_id
  ) => {
    try {
      const { question_title, question_description, question_image, topic_id } =
        questionInfo;
      const insertRes = await postgresql.query(
        `INSERT INTO question(question_title, question_description, question_image, topic_id, user_id, poll_question, question_incognito, sendmail_answer, have_video, created_day, status, question_view) 
      VALUES('${question_title}', '${question_description}', '${question_image}', ${Number(
          topic_id
        )}, ${Number(
          user_id
        )}, ${consultCheck}, ${incognitoCheck}, ${sendmailAnswerCheck}, ${addVideoCheck}, Now(), 1, 0) RETURNING question_id`
      );

      if (insertRes?.rows?.length)
        return {
          success: true,
          payload: insertRes?.rows[0]?.question_id || "",
        };

      return { success: false };
    } catch (error) {
      console.log("create question error >>>> ", error);
      return { success: false };
    }
  },

  createQuestionVideo: async (questionId, videoType, videoId) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO question_video(question_id, video_type, video_id) VALUES(${Number(
          questionId
        )}, '${videoType}', '${videoId}')`
      );
      if (createRes?.rows) return { success: true };
      return { success: false };
    } catch (error) {
      console.log("createQuestionVideo error >>>> ", error);
      return { success: false };
    }
  },

  createQuestionPoll: async (question, questionId) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO question_poll(question_id, poll_question) VALUES(${Number(
          questionId
        )}, '${question}')`
      );
      if (createRes?.rows) return { success: true };
      return { success: false };
    } catch (error) {
      console.log("createQuestionPoll error >>>> ", error);
      return { success: false };
    }
  },

  getAllQuestion: async (limit, offset, sort, search, topic, poll) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const listQuestion = await postgresql.query(
        `SELECT qt.*, tp.topic_name, ur.first_name as actor_firstname, ur.last_name as actor_lastname, ur.avatar as user_avatar,
        (SELECT COUNT(qa.answer_id) FROM question_answer qa WHERE qa.question_id = qt.question_id ) AS count_answer
        FROM question qt LEFT JOIN topic tp ON qt.topic_id = tp.topic_id LEFT JOIN users ur ON qt.user_id = ur.user_id WHERE ${
          search?.length
            ? `qt.question_title LIKE '%${search}%'`
            : `qt.question_title != '' `
        }  AND 
        ${
          topic && topic?.toString()?.length
            ? `tp.topic_id = ${Number(topic)}`
            : `tp.topic_id >  0`
        } 
        AND 
        ${
          poll === "true" || poll === "false"
            ? `qt.poll_question = ${poll}`
            : `(qt.poll_question = false OR qt.poll_question = true )`
        }   
        ORDER BY ${QUESTION_SORT[sort].sort} ${limitOffset}`
      );

      if (listQuestion) {
        const rows = listQuestion?.rows;
        if (sort === "NULL_ASWER") {
          const rowsFilter = rows?.filter((item) => {
            return Number(item?.count_answer) === 0;
          });
          return rowsFilter;
        }
        return rows;
      }
      return [];
    } catch (error) {
      console.log("getAllQuestion error >>>> ", error);
      return [];
    }
  },

  countTotalQuestion: async (sort, search, topic, poll) => {
    try {
      const listQuestion = await postgresql.query(
        `SELECT qt.*, tp.topic_name, ur.first_name as actor_firstname, ur.last_name as actor_lastname ,
        (SELECT COUNT(qa.answer_id) FROM question_answer qa WHERE qa.question_id = qt.question_id ) AS count_answer
        FROM question qt LEFT JOIN topic tp ON qt.topic_id = tp.topic_id LEFT JOIN users ur ON qt.user_id = ur.user_id WHERE ${
          search?.length
            ? `qt.question_title LIKE '%${search}%'`
            : `qt.question_title != '' `
        }  AND 
        ${
          topic && topic?.toString()?.length
            ? `tp.topic_id = ${Number(topic)}`
            : `tp.topic_id >  0`
        } 
        AND 
        ${
          poll === "true" || poll === "false"
            ? `qt.poll_question = ${poll}`
            : `qt.poll_question = false OR qt.poll_question = true `
        }   
        ORDER BY ${QUESTION_SORT[sort].sort}`
      );

      if (listQuestion) {
        const rows = listQuestion?.rows;
        if (sort === "NULL_ASWER") {
          const rowsFilter = rows?.filter((item) => {
            return Number(item?.count_answer) === 0;
          });
          return rowsFilter;
        }
        return rows?.length;
      }
      return 0;
    } catch (error) {
      console.log("countTotalQuestion error >>>> ", error);
      return 0;
    }
  },

  changeQuestionStatus: async (questionId, status) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE question SET status=${Number(
          status
        )} WHERE question_id=${Number(questionId)}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("changeQuestionStatus error >>>> ", error);
      return false;
    }
  },

  deleteQuestion: async (questionId) => {
    try {
      await postgresql.query(
        `DELETE FROM question_tag WHERE question_id=${questionId}`
      );
      await postgresql.query(
        `DELETE FROM question_video WHERE question_id=${questionId}`
      );
      await postgresql.query(
        `DELETE FROM question_mark WHERE question_id=${questionId}`
      );

      const answer = await postgresql.query(
        `SELECT answer_id FROM question_answer WHERE question_id=${Number(
          questionId
        )}`
      );

      if (answer?.rows?.length) {
        const { rows } = answer;
        for (let i = 0; i < rows?.length; i++) {
          await postgresql.query(
            `DELETE FROM question_answer_mark WHERE answer_id=${rows[i]?.answer_id}`
          );
          await postgresql.query(
            `DELETE FROM question_answer_children WHERE answer_id=${rows[i]?.answer_id}`
          );
          await postgresql.query(
            `DELETE FROM question_answer_favourite WHERE answer_id=${rows[i]?.answer_id}`
          );
        }
      }
      await postgresql.query(
        `DELETE FROM question_answer WHERE question_id=${questionId}`
      );

      const poll = await postgresql.query(
        `SELECT question_poll_id FROM question_poll WHERE question_id=${Number(
          questionId
        )}`
      );

      if (poll?.rows?.length) {
        const { rows } = poll;
        for (let i = 0; i < rows?.length; i++) {
          await postgresql.query(
            `DELETE FROM question_poll_choose WHERE question_poll_id=${rows[i]?.question_poll_id}`
          );
        }
      }

      await postgresql.query(
        `DELETE FROM question_poll WHERE question_id=${questionId}`
      );

      const deleteRes = await postgresql.query(
        `DELETE FROM question WHERE question_id=${questionId}`
      );

      if (deleteRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("deleteQuestion error >>>> ", error);
      return false;
    }
  },

  deleteQuestionAnswer: async(answerId) => {
    try{
      await postgresql.query(
        `DELETE FROM question_answer_mark WHERE answer_id=${Number(answerId)}`
      );
      await postgresql.query(
        `DELETE FROM question_answer_children WHERE answer_id=${Number(answerId)}`
      );
      await postgresql.query(
        `DELETE FROM question_answer_favourite WHERE answer_id=${Number(answerId)}`
      );

      const deleteRes = await postgresql.query(
        `DELETE FROM question_answer WHERE answer_id=${Number(answerId)}`
      );

      if ( deleteRes?.rows) return deleteRes
      return false
    }catch (error) {
      console.log("deleteQuestionAnswer error >>>> ", error);
      return 0;
    }
  },

  getQuestionById: async (questionId) => {
    try {
      const questionInfo = await postgresql.query(
        `SELECT qt.*, tp.topic_name, qv.video_id, qv.video_type, ur.first_name as actor_firstname, ur.last_name as actor_lastname, ur.avatar as user_avatar FROM question qt LEFT JOIN topic tp ON qt.topic_id = tp.topic_id 
        LEFT JOIN question_video qv ON qt.question_id = qv.question_id JOIN users ur ON qt.user_id = ur.user_id
        WHERE qt.question_id=${Number(questionId)}`
      );

      if (questionInfo?.rows?.length) return questionInfo?.rows[0];
      return {};
    } catch (error) {
      console.log("getQuestionById error >>>> ", error);
      return {};
    }
  },

  getQuestionTagById: async (questionId) => {
    try {
      const tagInfo = await postgresql.query(
        `SELECT qt.*, t.tag_title FROM question_tag qt JOIN tag t ON qt.tag_id = t.tag_id WHERE qt.question_id=${Number(
          questionId
        )}`
      );
      if (tagInfo?.rows?.length) return tagInfo?.rows;
      return [];
    } catch (error) {
      console.log("getQuestionById error >>>> ", error);
      return [];
    }
  },

  getQuestionPollById: async (questionId) => {
    try {
      const questionPoll = await postgresql.query(
        `SELECT qp.*, (SELECT COUNT(question_poll_id) FROM question_poll_choose qpc WHERE qpc.question_poll_id = qp.question_poll_id) AS poll_choose
        FROM question_poll qp WHERE qp.question_id=${Number(questionId)}`
      );
      if (questionPoll?.rows?.length) return questionPoll?.rows;
      return [];
    } catch (error) {
      console.log("getQuestionPollById error >>>> ", error);
      return [];
    }
  },

  getQuestionByUserId: async (userId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const listQuestion = await postgresql.query(
        `SELECT qt.*, tp.topic_name, ur.first_name as actor_firstname, ur.last_name as actor_lastname, ur.avatar as user_avatar,
        (SELECT COUNT(qa.answer_id) FROM question_answer qa WHERE qa.question_id = qt.question_id ) AS count_answer
        FROM question qt LEFT JOIN topic tp ON qt.topic_id = tp.topic_id LEFT JOIN users ur ON qt.user_id = ur.user_id WHERE qt.user_id = ${Number(
          userId
        )} ORDER BY qt.created_day DESC
        ${limitOffset} `
      );

      if (listQuestion?.rows) return listQuestion?.rows;
      return [];
    } catch (error) {
      console.log("getQuestionByUserId error >>>> ", error);
      return [];
    }
  },

  totalQuestionByUserId: async (userId) => {
    try {
      const listQuestion = await postgresql.query(
        `SELECT qt.*, tp.topic_name, ur.first_name as actor_firstname, ur.last_name as actor_lastname,
        (SELECT COUNT(qa.answer_id) FROM question_answer qa WHERE qa.question_id = qt.question_id ) AS count_answer
        FROM question qt LEFT JOIN topic tp ON qt.topic_id = tp.topic_id LEFT JOIN users ur ON qt.user_id = ur.user_id WHERE qt.user_id = ${Number(
          userId
        )}`
      );
      if (listQuestion?.rows?.length) return listQuestion?.rows?.length;
      return 0;
    } catch (error) {
      console.log("totalQuestionByUserId error >>>> ", error);
      return 0;
    }
  },

  getUserChoosePoll: async (questionPollId) => {
    try {
      const getQuery = await postgresql.query(
        `SELECT ur.last_name poll_user_last_name, ur.first_name poll_user_first_name, ur.user_id poll_user_user_id FROM question_poll_choose qpc JOIN users ur ON qpc.user_id = ur.user_id WHERE  qpc.question_poll_id = ${questionPollId}`
      );
      if (getQuery?.rows?.length) return getQuery?.rows;
      return [];
    } catch (error) {
      console.log("getUserChoosePoll error >>>> ", error);
      return [];
    }
  },

  createQuestionAnswer: async (
    questionId,
    userId,
    answerText,
    incognitoCheck
  ) => {
    try {
      const createQuery =
        await postgresql.query(`INSERT INTO question_answer(question_id, user_id, answer, created_day, status, question_incognito)
      VALUES(${Number(questionId)}, ${Number(
          userId
        )}, '${answerText}', Now(), 1, ${incognitoCheck})`);

      if (createQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("createQuestionAnswer error >>>> ", error);
      return false;
    }
  },

  getAllQuestionAnswer: async (questionId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);

      const getQuery = await postgresql.query(
        `SELECT qa.*, ur.first_name as actor_firstname, ur.last_name as actor_lastname, ur.avatar as user_avatar FROM question_answer qa JOIN users ur ON qa.user_id = ur.user_id WHERE qa.question_id=${Number(
          questionId
        )} ${limitOffset}`
      );

      if (getQuery?.rows) return getQuery?.rows;
      return [];
    } catch (error) {
      console.log("getAllQuestionAnswer error >>>> ", error);
      return [];
    }
  },

  countAllQuestionAnswer: async (questionId) => {
    try {
      const getQuery = await postgresql.query(
        `SELECT COUNT(question_id) as count_answer FROM question_answer WHERE question_id=${Number(
          questionId
        )}`
      );
      if (getQuery?.rows) return getQuery?.rows?.[0]?.count_answer;
      return 0;
    } catch (error) {
      console.log("getAllQuestionAnswer error >>>> ", error);
      return 0;
    }
  },

  findUserQuestionPoll: async (questionPollId, userId) => {
    try {
      const getQuery = await postgresql.query(
        `SELECT * FROM question_poll_choose WHERE question_poll_id=${Number(
          questionPollId
        )} AND user_id=${Number(userId)}`
      );
      if (getQuery?.rows?.length) return getQuery?.rows[0];
      return {};
    } catch (error) {
      console.log("findUserQuestionPoll error >>>> ", error);
      return {};
    }
  },

  deleteUserQuestionPoll: async (questionPollId, userId) => {
    try {
      const deleteQuery = await postgresql.query(
        `DELETE FROM question_poll_choose WHERE question_poll_id=${Number(
          questionPollId
        )} AND user_id=${Number(userId)}`
      );
      if (deleteQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("deleteUserQuestionPoll error >>>> ", error);
      return false;
    }
  },

  insertUserQuestionPoll: async (questionPollId, userId) => {
    try {
      const insertQuery = await postgresql.query(
        `INSERT INTO question_poll_choose(question_poll_id, user_id) VALUES(${Number(
          questionPollId
        )}, ${Number(userId)})`
      );
      if (insertQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("insertUserQuestionPoll error >>>> ", error);
      return false;
    }
  },

  changeQuestionView: async (questionId, view) => {
    try {
      const changeQuery = await postgresql.query(
        `UPDATE question SET question_view=${Number(
          view
        )} WHERE question_id=${Number(questionId)}`
      );
      if (changeQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("insertUserQuestionPoll error >>>> ", error);
      return false;
    }
  },

  getAllAnswerQuantity: async (fromDate, toDate) => {
    try {
      const answerQuantity = await postgresql.query(
        `SELECT COUNT(answer_id) AS answer_quantity FROM question_answer WHERE ${
          fromDate !== "undefined"
            ? `date(created_day) >= date('${fromDate}')`
            : "created_day is not null"
        } AND 
        ${
          toDate !== "undefined"
            ? `date(created_day) <= date('${toDate}')`
            : "created_day is not null"
        }`
      );

      if (answerQuantity?.rows?.length)
        return answerQuantity?.rows[0]?.answer_quantity;
      return 0;
    } catch (error) {
      console.log("getAllAnswer error >>>> ", error);
      return 0;
    }
  },

  countAllQuestion: async (fromDate, toDate) => {
    try {
      const questionQuantity = await postgresql.query(
        `SELECT COUNT(question_id) AS question_quantity FROM question WHERE ${
          fromDate !== "undefined"
            ? `date(created_day) >= date('${fromDate}')`
            : "created_day is not null"
        } AND 
        ${
          toDate !== "undefined"
            ? `date(created_day) <= date('${toDate}')`
            : "created_day is not null"
        }`
      );

      if (questionQuantity?.rows?.length)
        return questionQuantity?.rows[0]?.question_quantity;
      return 0;
    } catch (error) {
      console.log("countAllQuestion error >>>> ", error);
      return 0;
    }
  },

  addAnswerChild: async (answerId, userId, comment) => {
    try {
      const addQuery = await postgresql.query(
        `INSERT INTO question_answer_children(answer_id, user_id, answer, created_day, status, question_incognito) VALUES(${Number(
          answerId
        )}, ${Number(userId)}, '${comment}', Now(), 1, false)`
      );

      if (addQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("addAnswerChild error >>>> ", error);
      return false;
    }
  },

  getChildAnswer: async (answerId) => {
    try {
      const getQuery = await postgresql.query(
        `SELECT qa.*, ur.first_name as actor_firstname, ur.last_name as actor_lastname FROM question_answer_children qa JOIN users ur ON qa.user_id = ur.user_id WHERE qa.answer_id=${Number(
          answerId
        )}`
      );

      if (getQuery?.rows) return getQuery?.rows;
      return [];
    } catch (error) {
      console.log("getChildAnswer error >>>> ", error);
      return [];
    }
  },

  deleteUserAnswerFavourite: async (answerId, userId) => {
    try {
      const deleteQuery = await postgresql.query(
        `DELETE FROM question_answer_favourite WHERE answer_id=${Number(
          answerId
        )} AND user_id=${Number(userId)}`
      );

      if (deleteQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("deleteUserAnswerFavourite error >>>> ", error);
      return false;
    }
  },

  insertUserAnswerFavourite: async (answerId, userId) => {
    try {
      const insertQuery = await postgresql.query(
        `INSERT INTO question_answer_favourite(answer_id, user_id, created_day) VALUES(${Number(
          answerId
        )}, ${Number(userId)}, Now())`
      );
      if (insertQuery?.rows) return true;
      return false;
    } catch (error) {
      console.log("insertUserAnswerFavourite error >>>> ", error);
      return false;
    }
  },

  getQuestionAnswerFavourite: async (answerId) => {
    try {
      const getQuery = await postgresql.query(
        `SELECT * FROM question_answer_favourite WHERE answer_id=${Number(
          answerId
        )}`
      );
      if (getQuery?.rows?.length) return getQuery?.rows;
      return [];
    } catch (error) {
      console.log("getQuestionAnswerFavourite error >>>> ", error);
      return [];
    }
  },

  markUserQuestionScore: async (questionId, userId, currentStar) => {
    try {
    } catch (error) {
      console.log("markUserQuestionScore error >>>> ", error);
      return [];
    }
  },

  getUserQuestionMark: async (questionId, userId) => {
    try {
      const queryRes = await postgresql.query(
        `SELECT qm.* FROM question_mark qm  WHERE qm.question_id=${Number(
          questionId
        )} AND qm.user_id=${Number(userId)}`
      );
      if (queryRes?.rows) return queryRes?.rows[0];
      return {};
    } catch (error) {
      console.log("checkUserQuestionMark error >>>> ", error);
      return {};
    }
  },

  updateUserQuestionMark: async (questionId, userId, currentStar) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE question_mark SET score=${Number(
          currentStar
        )} WHERE question_id=${Number(questionId)} AND user_id=${Number(
          userId
        )}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateUserQuestionMark error >>>> ", error);
      return false;
    }
  },

  insertUserQuestionMark: async (questionId, userId, currentStar) => {
    try {
      const insertRes = await postgresql.query(
        `INSERT INTO question_mark(question_id, user_id, score, created_day) VALUES(${Number(
          questionId
        )}, ${Number(userId)}, ${Number(currentStar)}, Now())`
      );
      if (insertRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateUserQuestionMark error >>>> ", error);
      return false;
    }
  },

  getUserAnswerMark: async (answerId, userId) => {
    try {
      const queryRes = await postgresql.query(
        `SELECT * FROM question_answer_mark WHERE answer_id=${Number(
          answerId
        )} AND user_id=${Number(userId)}`
      );
      if (queryRes?.rows) return queryRes?.rows[0];
      return {};
    } catch (error) {
      console.log("getUserAnswerMark error >>>> ", error);
      return {};
    }
  },

  updateUserAnswerMark: async (answerId, userId, currentStar) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE question_answer_mark SET score=${Number(
          currentStar
        )} WHERE answer_id=${Number(answerId)} AND user_id=${Number(userId)}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateUserAnswerMark error >>>> ", error);
      return false;
    }
  },

  insertUserAnswerMark: async (answerId, userId, currentStar) => {
    try {
      const insertRes = await postgresql.query(
        `INSERT INTO question_answer_mark(answer_id, user_id, score, created_day) VALUES(${Number(
          answerId
        )}, ${Number(userId)}, ${Number(currentStar)}, Now())`
      );
      if (insertRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("insertUserAnswerMark error >>>> ", error);
      return false;
    }
  },

  getQuestionMark: async (questionId) => {
    try {
      const selectString1 = `(SELECT COUNT(question_id) FROM question_mark WHERE score = 1 AND question_mark.question_id = qa0.question_id ) AS count_score_1`;
      const selectString2 = `(SELECT COUNT(question_id) FROM question_mark WHERE score = 2 AND question_mark.question_id = qa0.question_id ) AS count_score_2`;
      const selectString3 = `(SELECT COUNT(question_id) FROM question_mark WHERE score = 3 AND question_mark.question_id = qa0.question_id ) AS count_score_3`;
      const selectString4 = `(SELECT COUNT(question_id) FROM question_mark WHERE score = 4 AND question_mark.question_id = qa0.question_id ) AS count_score_4`;
      const selectString5 = `(SELECT COUNT(question_id) FROM question_mark WHERE score = 5 AND question_mark.question_id = qa0.question_id ) AS count_score_5`;

      const queryRes = await postgresql.query(
        `SELECT ${selectString1}, ${selectString2}, ${selectString3}, ${selectString4}, ${selectString5} FROM question_mark qa0 WHERE qa0.question_id=${Number(
          questionId
        )}`
      );
      if (queryRes?.rows) return queryRes?.rows;
      return [];
    } catch (error) {
      console.log("getQuestionFavourite error >>>> ", error);
      return [];
    }
  },

  getQuestionAnswerMark: async (answerId) => {
    try {
      const selectString1 = `(SELECT COUNT(answer_id) FROM question_answer_mark WHERE score = 1 AND question_answer_mark.answer_id = qa0.answer_id ) AS count_score_1`;
      const selectString2 = `(SELECT COUNT(answer_id) FROM question_answer_mark WHERE score = 2 AND question_answer_mark.answer_id = qa0.answer_id ) AS count_score_2`;
      const selectString3 = `(SELECT COUNT(answer_id) FROM question_answer_mark WHERE score = 3 AND question_answer_mark.answer_id = qa0.answer_id ) AS count_score_3`;
      const selectString4 = `(SELECT COUNT(answer_id) FROM question_answer_mark WHERE score = 4 AND question_answer_mark.answer_id = qa0.answer_id ) AS count_score_4`;
      const selectString5 = `(SELECT COUNT(answer_id) FROM question_answer_mark WHERE score = 5 AND question_answer_mark.answer_id = qa0.answer_id ) AS count_score_5`;

      const queryRes = await postgresql.query(
        `SELECT ${selectString1}, ${selectString2}, ${selectString3}, ${selectString4}, ${selectString5} FROM question_answer_mark qa0 WHERE qa0.answer_id=${Number(
          answerId
        )}`
      );
      if (queryRes?.rows) return queryRes?.rows;
      return [];
    } catch (error) {
      console.log("getQuestionAnswerMark error >>>> ", error);
      return [];
    }
  },

  countBestAnswer: async () => {
    try {
      const bestAnswer = await postgresql.query(
        "SELECT COUNT(answer_id) as count_answer FROM question_answer_mark WHERE score= 5 GROUP BY answer_id"
      );
      if (bestAnswer?.rows?.length) return bestAnswer?.rows[0]?.count_answer;
      return 0;
    } catch (error) {
      console.log("countBestAnswer error >>>> ", error);
      return 0;
    }
  },

  findUserFromQuestionId: async (questionId) => {
    try{
      const question = await postgresql.query(`SELECT qt.sendmail_answer, qt.created_day, ur.email FROM question qt JOIN users ur ON qt.user_id = ur.user_id WHERE question_id=${Number(questionId)}`)
      if ( question?.rows?.length ) return question?.rows[0]
      return {}

    }catch (error) {
      console.log("findUserFromQuestionId error >>>> ", error);
      return {};
    }
  },

  changeQuestionCommentDisabled: async(questionId, disabled) => {
    try{
      const updateRes = await postgresql.query(`UPDATE question SET disabled_answer=${disabled} WHERE question_id=${Number(questionId)}`)
      if ( updateRes?.rows ) return true
      return false
    }catch (error) {
      console.log("changeQuestionCommentDisabled error >>>> ", error);
      return false;
    }
  }
};
