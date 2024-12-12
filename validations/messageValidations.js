const { body } = require('express-validator');
const mongoose = require('mongoose');

const forbiddenWords = ['instagram', 'wass', 'watsup', 'telegram', 'ws', 'puta', 'idiota'];

const messageValidation = [
	body('payload.recep')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un usuario receptor para el mensaje')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario receptor debe ser un id válido'),
    body('messageValidation')
        .trim()
        .notEmpty()
        .matches(/^[a-zA-Z0-9\s.,'’\-\u00C0-\u017F¡!¿?()""]*$/)
        .withMessage('Se requiere de un cuerpo de mensaje')
        // Phone number filter
        .custom((value) => {
            const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d-\s]{5,}/g;
            if (phoneRegex.test(value)) {
                throw new Error('No se permiten números de teléfono.');
            }
            return true;
        })
        // Words filter
        .custom((value) => {
            const lowerCaseMessage = value.toLowerCase(); 
            for (let word of forbiddenWords) {
                if (lowerCaseMessage.includes(word)) {
                    throw new Error(`El mensaje contiene una palabra prohibida: ${word}`);
                }
            }
            return true; 
        })
]

module.exports = { messageValidation }