const express = require('express');

const readMessages = require('../controllers/messages/readMessages');
const sendMessage = require('../controllers/messages/sendMessage');

const {verifyToken} = require('../middleware/authToken');

const router = express.Router();

router.get('/read/:contact', verifyToken, readMessages);

router.post('/send', verifyToken, sendMessage);


module.exports = router;