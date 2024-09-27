const express = require('express');

const router = express.Router();

router.use('/user', require('./userRoutes'));
router.use('/chat', require('./messageRoutes'));
router.use('/privacy', require('./privacyRoutes'));

module.exports = router;