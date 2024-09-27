const { body } = require('express-validator');

const addBlockedUserValidation = [
	body('payload.blockUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para bloquear')
        .isEmail()
        .withMessage('El usuario debe ser un email válido'),
]

const removeBlockedUserValidaiton = [
	body('payload.unblockUser')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario para desbloquear')
        .isEmail()
        .withMessage('El usuario debe ser un email válido'),
]

module.exports = { 
    addBlockedUserValidation, 
    removeBlockedUserValidaiton
}