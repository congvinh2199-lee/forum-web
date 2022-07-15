import AxiosClient from "./axiosClient";

const QuestionAPI = {
  createNewQuestion(questionData) {
    const url = `/question`;
    return AxiosClient.post(url, {questionData});
  },

  getAllQuestion(limit, offset, getPoll, sort, searchText, topic, poll) {
    const url = `/question?limit=${limit}&offset=${offset}&getPoll=${getPoll}&sort=${sort}&search=${searchText}&topic=${topic || ''}&poll=${poll}`;
    return AxiosClient.get(url)
  },

  getQuestionByUserId(limit, offset, userId){
    const url = `/question/user/${userId}?limit=${limit}&offset=${offset}`;
    return AxiosClient.get(url)
  },

  changeQuestionStatus(status, questionId) {
    const url = `/question/status/${questionId}`;
    return AxiosClient.put(url, {status})
  },

  deleteQuestion(questionId) {
    const url = `/question/${questionId}`;
    return AxiosClient.delete(url)
  },

  getQuestionDetail(questionId) {
    const url = `/question/${questionId}`;
    return AxiosClient.get(url)
  },

  createQuestionAnswer(questionId, questionData) {
    const url = `/question/answer/${questionId}/create`;
    return AxiosClient.post(url, {questionData});
  },

  getAllQuestionAnswer(questionId, limit, offset){
    const url = `/question/answer/${questionId}/get?limit=${limit}&offset=${offset}`;
    return AxiosClient.get(url);
  },

  userVotePoll(questtionPollId, userId) {
    const url = `/question/poll/${questtionPollId}`;
    return AxiosClient.put(url, {userId});
  },

  deleteUserVote(questtionPollId, userId){
    const url = `/question/poll/${questtionPollId}?userId=${userId}`;
    return AxiosClient.delete(url, {userId});
  },

  changeQuestionView(questionId, view){
    const url = `/question/view/${questionId}?view=${view}`;
    return AxiosClient.put(url);
  },

  childAnswer(answerId, userId, comment) {
    const url = `/question/answer/child`;
    return AxiosClient.post(url, {answerId, userId, comment});
  },

  changeUserAnswerFavourite(answerId, type, userId) {
    const url = `/question/answer/favourite`;
    return AxiosClient.put(url, {answerId, type, userId});
  },

  markUserQuestionScore(questionId, userId, currentStar){
    const url = `/question/score`;
    return AxiosClient.put(url, {questionId, userId, currentStar});
  },

  markUserAnswerScore(answerId, userId, currentStar){
    const url = `/question/answer/score`;
    return AxiosClient.put(url, {answerId, userId, currentStar});
  },

  deleteQuestionAnswer(answerId){
    const url = `/question/answer/${answerId}/delete`;
    return AxiosClient.delete(url)
  },

  changeQuestionCommentDisabled(questionId, disabled){
    const url = `/question/answer/disabled/${questionId}`;
    return AxiosClient.put(url, {disabled})
  }

};
export default QuestionAPI;
