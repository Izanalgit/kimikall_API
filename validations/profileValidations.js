const { body } = require('express-validator');
const mongoose = require('mongoose');

const profileValidation = [
    //Normal profile

    //MIN AGE
	body('payload.profile.age')
        .trim()
        .isInt({min:18})
        .withMessage('La edad debe ser numerica, igual o más 18'),
    //GENRE
    body('payload.profile.genre')
        .trim()
        .isIn([
            'Hombre',
            'Mujer',
            'Otro',
        ])
        .withMessage('Género no contemplado'),
    //ORENTATION
    body('payload.profile.orentation')
        .trim()
        .isIn([
            'Hetero',
            'Homo',
            'Otro',
        ])
        .withMessage('Orientación no contemplada'),
    //SPECIAL CONDITION
    body('payload.profile.special')
        .trim()
        .isIn([
            'A',
            'B',
            'C',
            'D',
            'F'
        ])
        .withMessage('Condición no contemplada'),
    //BIOGRAPHI
    body('payload.bio')
        .trim()
        // .isLength({ min: 800})
        // .withMessage('La biografía tener como máximo 800 carácteres')
        .isAlphanumeric()
        .withMessage('La biografía debe ser con carácteres alfanuméricos'),
    //LOCATION
    // body('payload.profile.location')
    //     .trim()
    //     .isIn([])
    //     .withMessage('El campo de localidad debe ser ....'),

    //Extended profile

    //HEIGHT
	body('payload.extended.height')
        .trim()
        .isInt()
        .withMessage('La altura debe ser un numero entero'),
    //ETHNIA
    body('payload.extended.ethnia')
        .trim()
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
        .isBoolean()
        .withMessage('El campo de fumar ha de ser booleano'),
    //DRINKING
    body('payload.extended.drinking')
        .trim()
        .isBoolean()
        .withMessage('El campo de beber ha de ser booleano'),

]
module.exports = { profileValidation }