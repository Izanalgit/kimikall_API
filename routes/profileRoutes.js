const express = require('express');

const getProfile = require('../controllers/profile/getProfile');
const getContactProfile = require('../controllers/profile/getContactProfile');
const imageProfile = require('../controllers/profile/imageProfile');
const deleteImageProfile = require('../controllers/profile/deleteImageProfile');
const updateProfile = require('../controllers/profile/updateProfile');

const {verifyToken} = require('../middleware/authToken');
const {upload} = require('../middleware/uploader');

const {validate} = require('../middleware/validate');
const {profileValidation} = require('../validations/profileValidations');


const router = express.Router();

router.get('/', verifyToken, getProfile);

router.get('/:contact', verifyToken, getContactProfile);

router.post('/image/:imageType', verifyToken, upload.single('image'), imageProfile);

router.get('/delete-image/:imageType', verifyToken, deleteImageProfile);

router.post('/update', verifyToken, profileValidation, validate, updateProfile);


module.exports = router;