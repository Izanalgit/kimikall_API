const { body } = require('express-validator');
const mongoose = require('mongoose');

const addBlockedUserValidation = [
	body('payload.blockUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para bloquear')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario debe ser un id válido'),
]

const removeBlockedUserValidaiton = [
	body('payload.unblockUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para desbloquear')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario debe ser un id válido'),
]

const reportUserValidaiton = [
    body('payload.reportUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para reportarlo')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario debe ser un id válido'),
    body('payload.problem')
        .trim()
        .notEmpty()
        .matches(/^[a-zA-Z0-9\s.,'-]*$/)
        .withMessage('Se requiere de un problema para reportar')
]

module.exports = { 
    addBlockedUserValidation, 
    removeBlockedUserValidaiton,
    reportUserValidaiton
}