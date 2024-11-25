const express = require('express');

const router = express.Router();

router.use('/user', require('./userRoutes'));
router.use('/profile', require('./profileRoutes'));
router.use('/contacts', require('./contactsRoutes'));
router.use('/chat', require('./messageRoutes'));
router.use('/privacy', require('./privacyRoutes'));
router.use('/premy', require('./premyRoutes'));

module.exports = router;