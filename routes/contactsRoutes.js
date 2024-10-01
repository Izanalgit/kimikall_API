const express = require('express');

const addContact = require('../controllers/profile/getProfile');
const deleteContact = require('../controllers/profile/imageProfile');
const getContactList = require('../controllers/profile/updateProfile');

const {verifyToken} = require('../middleware/authToken');


const router = express.Router();

router.patch('/add', verifyToken, addContact);

router.patch('/remove', verifyToken, deleteContact);

router.get('/list', verifyToken, getContactList);


module.exports = router;