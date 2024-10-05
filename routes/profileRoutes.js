const express = require('express');

const getProfile = require('../controllers/profile/getProfile');
const imageProfile = require('../controllers/profile/imageProfile');
const updateProfile = require('../controllers/profile/updateProfile');

const {verifyToken} = require('../middleware/authToken');
const {upload} = require('../middleware/uploader');


const router = express.Router();

router.get('/', verifyToken, getProfile);

router.post('/image/:imageType', verifyToken, upload.single('image'), imageProfile);

router.post('/update', verifyToken, updateProfile);


module.exports = router;