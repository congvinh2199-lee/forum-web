const express =  require('express');
const topiController = require('../controllers/topic');
const router = express.Router();

router.get('/', topiController.getAllTopic);
router.post('/', topiController.createNewTopic);
router.put('/:topicId', topiController.updateTopicData);
router.delete('/:topicId', topiController.deleteTopicData);

module.exports = router;
