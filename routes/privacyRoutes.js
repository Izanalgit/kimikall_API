const express = require('express');

const blockUser = require('../controllers/privacy/blockUser');
const unblockUser = require('../controllers/privacy/unblockUser');
const getBlockUsers = require('../controllers/privacy/getBlockUsers');

const {verifyToken} = require('../middleware/authToken');

const router = express.Router();

router.post('/block', verifyToken, blockUser);

router.post('/unblock', verifyToken, unblockUser);

router.get('/block', verifyToken, getBlockUsers);


module.exports = router;