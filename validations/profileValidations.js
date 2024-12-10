const { body } = require('express-validator');
const mongoose = require('mongoose');

const profileValidation = [
    //Normal profile

    //MIN AGE
	body('payload.profile.age')
        .optional()
        .isInt()
        .withMessage('La edad debe ser un número entero.')
        .custom(value => {
            const year = value.toString();
            const firstChars = year.slice(0, 2);

            if (year.length !== 4 || (firstChars !== '19' && firstChars !== '20')) {
                throw new Error('Debes escribir un año de nacimiento válido (ej. 1990, 2001).');
            }

            const minBirthYear = new Date().getFullYear() - 18;
            if (value > minBirthYear) {
                throw new Error('Debes ser mayor de 18 años.');
            }

            return true;
        }),
    //GENRE
    body('payload.profile.genre')
        .trim()
        .optional()
        .isIn([
            'Hombre',
            'Mujer',
            'Otro',
        ])
        .withMessage('Género no contemplado'),
    //ORENTATION
    body('payload.profile.orentation')
        .trim()
        .optional()
        .isIn([
            'Hetero',
            'Homo',
            'Otro',
        ])
        .withMessage('Orientación no contemplada'),
    //SPECIAL CONDITION
    body('payload.profile.special')
        .optional()
        .custom(value => {
            if (!Array.isArray(value)) {
                throw new Error('Condición especial debe ser un array');
            }
            const allowedValues = ['A', 'B', 'C', 'D', 'F'];
            const isValid = value.every(val => allowedValues.includes(val));
            if (!isValid) {
                throw new Error('Condición no contemplada');
            }
            return true;
        }),
    // BIOGRAPHI
    body('payload.profile.bio')
        .optional()
        .isLength({ max: 800})
        .withMessage('La biografía tener como máximo 800 carácteres')
        .matches(/^[a-zA-Z0-9\s.,'-]*$/)
        .withMessage('La biografía debe ser con carácteres alfanuméricos'),
    //LOCATION
    // body('payload.profile.location')
    //     .trim()
    //     .optional()
    //     .isIn([])
    //     .withMessage('El campo de localidad debe ser ....'),

    //Extended profile

    //HEIGHT
	body('payload.extended.height')
        .trim()
        .optional()
        .isInt()
        .withMessage('La altura debe ser un numero entero'),
    //ETHNIA
    body('payload.extended.ethnia')
        .trim()
        .optional()
        .isIn([
            'Asiática',
            'Caucásico',
            'Amerindia',
            'Africana',
            'Sudeste Asiática'
        ])
        .withMessage('La etnia escogida no es válida'),
    //RELIGION
    body('payload.extended.religion')
        .trim()
        .optional()
        .isIn([
            'Cristianísmo',
            'Judaísmo',
            'Hinduísmo',
            'Islam',
            'Budísmo'
        ])
        .withMessage('La religión escogida no es válida'),
    //RELATIONSHIP
    body('payload.extended.relationship')
        .trim()
        .optional()
        .isIn([
            'Soltería',
            'Divorcio',
            'Pareja',
            'Matrimonio',
            'Viudedad'
        ])
        .withMessage('El estado de relacón no es válido'),
    //SMOKING
    body('payload.extended.smoking')
        .trim()
        .optional()
        .isBoolean()
        .withMessage('El campo de fumar ha de ser booleano'),
    //DRINKING
    body('payload.extended.drinking')
        .trim()
        .optional()
        .isBoolean()
        .withMessage('El campo de beber ha de ser booleano'),

]
module.exports = { profileValidation }