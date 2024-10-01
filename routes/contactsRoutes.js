const express = require('express');

const addContact = require('../controllers/contacts/addContact');
const deleteContact = require('../controllers/contacts/deleteContact');
const getContactList = require('../controllers/contacts/getContacts');

const {verifyToken} = require('../middleware/authToken');


const router = express.Router();

router.patch('/add', verifyToken, addContact);

router.patch('/remove', verifyToken, deleteContact);

router.get('/list', verifyToken, getContactList);


module.exports = router;