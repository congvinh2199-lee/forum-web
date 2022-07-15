const express =  require('express');
const questionController = require('../controllers/question');
const router = express.Router();

router.post('/', questionController.createNewQuestion);
router.get('/', questionController.getAllQuestion);
router.get('/user/:userId', questionController.getQuestionByUserId);
router.put('/status/:questionId', questionController.changeQuestionStatus);
router.delete('/:questionId', questionController.deleteQuestion);
router.get('/:questionId', questionController.getQuestionDetail);
router.post('/answer/:questionId/create', questionController.createQuestionAnswer);
router.get('/answer/:questionId/get', questionController.getAllQuestionAnswer);
router.put('/poll/:questionPollId', questionController.voteQuestionPoll);
router.delete('/poll/:questionPollId', questionController.deleteQuestionPoll);
router.put('/view/:questionId', questionController.changeQuestionView);
router.post('/answer/child', questionController.addAnswerChild);
router.put('/answer/favourite', questionController.changeUserAnswerFavourite);
router.put('/score', questionController.markUserQuestionScore);
router.put('/answer/score', questionController.markUserAnswerScore);
router.delete('/answer/:answerId/delete', questionController.deleteQuestionAnswer);
router.put('/answer/disabled/:questionId', questionController.changeQuestionCommentDisabled);

module.exports = router;
