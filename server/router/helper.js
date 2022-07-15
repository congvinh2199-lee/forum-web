const express =  require('express');
const helperController = require('../controllers/helper');
const router = express.Router();

router.get('/', helperController.getAllHelper);
router.post('/', helperController.createNewHelper);
router.put('/:helperId', helperController.updateHelperData);
router.delete('/:helperId', helperController.deleteHelperData);

module.exports = router;
