const { body } = require('express-validator');
const mongoose = require('mongoose');

const messageValidation = [
	body('payload.recep')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario receptor para el mensaje')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario receptor debe ser un id válido'),
    body('payload.message')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un cuerpo de mensaje')
]

module.exports = { messageValidation }