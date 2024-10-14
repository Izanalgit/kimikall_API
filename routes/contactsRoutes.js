const express = require('express');

const requestContact = require('../controllers/contacts/requestContact');
const addContact = require('../controllers/contacts/addContact');
const deleteContact = require('../controllers/contacts/deleteContact');
const getContactList = require('../controllers/contacts/getContacts');
const searchContacts = require('../controllers/contacts/searchContacts');

const {verifyToken} = require('../middleware/authToken');

const {validate} = require('../middleware/validate');
const {
    contactIdNewValidation,
    contactIdDeleteValidation,
    contactSearchValidation
} = require('../validations/contactsValidations');

const router = express.Router();

router.patch('/request', verifyToken,contactIdNewValidation, validate, requestContact);

router.patch('/add', verifyToken,contactIdNewValidation, validate, addContact);

router.patch('/remove', verifyToken,contactIdDeleteValidation, validate, deleteContact);

router.get('/list', verifyToken, getContactList);

router.post('/search', verifyToken, contactSearchValidation, validate, searchContacts);


module.exports = router;