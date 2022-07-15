const express =  require('express');
const infoController = require('../controllers/info');
const router = express.Router();

router.get('/quantity', infoController.getWebsiteQuantityInfo);

module.exports = router;
