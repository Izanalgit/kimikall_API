const express = require('express');

const readMessages = require('../controllers/messages/readMessages');
const countMessages = require('../controllers/messages/countMessages');
const checkMessage = require('../controllers/messages/checkMessage');
const sendMessage = require('../controllers/messages/sendMessage');

const {verifyToken} = require('../middleware/authToken');

const {validate} = require('../middleware/validate');
const {messageValidation} = require('../validations/messageValidations');

const router = express.Router();

router.get('/read/:contact', verifyToken, readMessages);

router.get('/count', verifyToken, countMessages);

router.patch('/check', verifyToken, checkMessage);

router.post('/send', verifyToken, messageValidation, validate, sendMessage);


module.exports = router;