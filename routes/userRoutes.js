const express = require('express');

const { verifyToken } = require('../middleware/authToken');

const singupUser = require('../controllers/users/singUpUser')
const createUser = require('../controllers/users/createUser');
const updateUser = require('../controllers/users/updateUser');
const deleteUser = require('../controllers/users/deleteUser');
const logInUser = require('../controllers/users/logInUser');
const logOutUser = require('../controllers/users/logOutUser');
const getKey = require('../controllers/users/getPrivateKeyPass');
const getRecoverKey = require('../controllers/users/forgottenPassGet');
const recoverUser = require('../controllers/users/forgottenPassChange');

const {validate} = require('../middleware/validate');
const {
    userValidation,
    userUpdateValidation,
    credentialsValidation
} = require('../validations/userValidations');

const router = express.Router();

router.post('/new', userValidation, validate, singupUser);

router.get('/verify/:userKey', createUser);

router.patch('/update', verifyToken, userUpdateValidation, validate, updateUser);

router.delete('/delete', verifyToken, credentialsValidation, validate, deleteUser);

router.post('/login', credentialsValidation, validate, logInUser);

router.post('/logout', verifyToken, logOutUser);

router.get('/rekey', verifyToken, getKey);

router.post('/forgotten', getRecoverKey);

router.post('/recover', recoverUser);


module.exports = router;