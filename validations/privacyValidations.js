const { body } = require('express-validator');
const mongoose = require('mongoose');

const addBlockedUserValidation = [
	body('payload.blockUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para bloquear')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario debe ser un email válido'),
]

const removeBlockedUserValidaiton = [
	body('payload.unblockUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para desbloquear')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario debe ser un email válido'),
]

module.exports = { 
    addBlockedUserValidation, 
    removeBlockedUserValidaiton
}