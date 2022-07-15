const { getAllAnswerQuantity, countAllQuestion, countBestAnswer } = require("../model/question");
const { countUser } = require("../model/user");

module.exports.infoMiddleware = {
  getWebsiteQuantityInfo: async(fromDate, toDate) => {
    const answer = await getAllAnswerQuantity(fromDate, toDate) 
    const question = await countAllQuestion(fromDate, toDate)
    const bestAnswer = await countBestAnswer(fromDate, toDate)
    const member = await countUser(fromDate, toDate)

    return {success: true, payload: {
      answer,
      question,
      bestAnswer,
      member
    }}
  }
};
