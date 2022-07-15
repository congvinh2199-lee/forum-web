const express =  require('express');
const contactController = require('../controllers/contact');
const router = express.Router();

router.get('/', contactController.getAllContact);
router.post('/', contactController.createNewContact);
router.delete('/:contactId', contactController.deleteContactData);

module.exports = router;
