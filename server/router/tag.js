const express =  require('express');
const tagController = require('../controllers/tag');
const router = express.Router();

router.get('/trending', tagController.getTagTrending);
router.get('/', tagController.getAllTag);

module.exports = router;
