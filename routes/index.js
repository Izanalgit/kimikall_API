const express = require('express');

const router = express.Router();

router.use('/provechat', require('../controllers/chats/probe'));

module.exports = router;