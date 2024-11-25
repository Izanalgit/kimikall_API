const express = require('express');

const addTokens = require('../controllers/premy/provisionalAddTokens');
const countPremy = require('../controllers/premy/countTokens');

const {verifyToken} = require('../middleware/authToken');

const router = express.Router();

router.get('/addToken/:tokenType', verifyToken, addTokens);

router.get('/count', verifyToken, countPremy);

module.exports = router;