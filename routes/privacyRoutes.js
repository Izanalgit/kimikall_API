const express = require('express');

const reportUser = require('../controllers/privacy/reportUser');
const blockUser = require('../controllers/privacy/blockUser');
const unblockUser = require('../controllers/privacy/unblockUser');
const getBlockUsers = require('../controllers/privacy/getBlockUsers');

const {verifyToken} = require('../middleware/authToken');

const {validate} = require('../middleware/validate');
const {
    reportUserValidaiton,
    addBlockedUserValidation,
    removeBlockedUserValidaiton
} = require('../validations/privacyValidations');

const router = express.Router();

router.post('/report', verifyToken, reportUserValidaiton, validate, reportUser);

router.post('/block', verifyToken, addBlockedUserValidation, validate, blockUser);

router.post('/unblock', verifyToken, removeBlockedUserValidaiton, validate, unblockUser);

router.get('/block', verifyToken, getBlockUsers);


module.exports = router;