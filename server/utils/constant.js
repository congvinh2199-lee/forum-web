const QUESTION_SORT = {
  SORT_DATE_DESC: { type: "SORT_DATE_DESC", sort: "qt.question_id DESC" },
  SORT_ANSWER_DESC: {
    type: "SORT_ANSWER_DESC",
    sort: "count_answer DESC",
  },
  SORT_VIEW_DESC: {
    type: "SORT_ANSWER_DESC",
    sort: "qt.question_view DESC",
  },
  SORT_VOTE_DESC: {
    type: "SORT_VOTE_DESC",
    sort: "qt.question_view DESC",
  },
  NULL_ASWER: { type: "NULL_ASWER", sort: "qt.question_id DESC" },
};

const WEB_DOMAIN = 'http://localhost:3000';

module.exports = {
  QUESTION_SORT,
  WEB_DOMAIN
}