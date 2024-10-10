const express = require('express');

const { verifyToken } = require('../middleware/authToken');

const singupUser = require('../controllers/users/singUpUser')
const createUser = require('../controllers/users/createUser');
const updateUser = require('../controllers/users/updateUser');
const deleteUser = require('../controllers/users/deleteUser');
const logInUser = require('../controllers/users/logInUser');
const logOutUser = require('../controllers/users/logOutUser');

const router = express.Router();

router.post('/new', singupUser);

router.get('/verify/:userKey', createUser);

router.patch('/update', verifyToken, updateUser);

router.delete('/delete', verifyToken, deleteUser);

router.post('/login', logInUser);

router.post('/logout', verifyToken, logOutUser);


module.exports = router;