const express = require('express');

const readMessages = require('../controllers/messages/readMessages');
const sendMessage = require('../controllers/messages/sendMessage');

const {verifyToken} = require('../middleware/authToken');

const {validate} = require('../middleware/validate');
const {messageValidation} = require('../validations/messageValidations');

const router = express.Router();

router.get('/read/:contact', verifyToken, readMessages);

router.post('/send', verifyToken, messageValidation, validate, sendMessage);


module.exports = router;