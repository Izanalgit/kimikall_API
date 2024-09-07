const express = require('express');

const router = express.Router();

router.use('/provechat', require('../controllers/messages/probe'));

module.exports = router;