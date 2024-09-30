const express = require('express');

const getProfile = require('../controllers/profile/getProfile');
const imageProfile = require('../controllers/profile/imageProfile');
const updateProfile = require('../controllers/profile/updateProfile');

const {verifyToken} = require('../middleware/authToken');
const {upload} = require('../middleware/uploader');


const router = express.Router();

router.get('/read/:contact', verifyToken, getProfile);

router.put('/image', verifyToken, upload.single('image'), imageProfile);

router.post('/send', verifyToken, updateProfile);


module.exports = router;