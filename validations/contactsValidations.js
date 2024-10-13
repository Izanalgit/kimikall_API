const { body } = require('express-validator');
const mongoose = require('mongoose');

const contactIdNewValidation = [
	body('payload.newContact')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un id de usuario para gestionar los contactos')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El id de usuario debe ser válido'),

]

const contactIdDeleteValidation = [
	body('payload.removeContact')
        .trim()
        .notEmpty()
        .withMessage('Se requiere de un id de usuario para eliminarlo de contactos')
        .custom(id => mongoose.isValidObjectId(id))
        .withMessage('El usuario receptor debe ser un id válido'),

]

const contactSearchValidation = [
    //Normal search

    //MIN AGE
	body('payload.normalSearch.minAge')
        .trim()
        .isInt({min:18})
        .withMessage('La edad mínima debe ser numerica, igual o más 18'),
    //MAX AGE
    body('payload.normalSearch.maxAge')
        .trim()
        .isInt()
        .withMessage('La edad máxima debe ser numerica'),
    //LOCATION
    body('payload.normalSearch.location')
        .trim()
        .isBoolean()
        .withMessage('El campo de localidad debe ser boleano, true en caso de filtrar por cercania'),

    //Extended search

    //MIN HEIGHT
	body('payload.expandedSearch.minHeight')
        .trim()
        .isInt()
        .withMessage('La altura mínima debe ser un numero entero'),
    //MAX HEIGHT
    body('payload.expandedSearch.maxHeight')
        .trim()
        .isInt()
        .withMessage('La altura mínima debe ser un numero entero'),
    //ETHNIA
    body('payload.expandedSearch.ethnia')
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
    body('payload.expandedSearch.religion')
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
    body('payload.expandedSearch.relationship')
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
    body('payload.expandedSearch.smoking')
        .trim()
        .isBoolean()
        .withMessage('El campo de fumar ha de ser booleano'),
    //DRINKING
    body('payload.expandedSearch.drinking')
        .trim()
        .isBoolean()
        .withMessage('El campo de beber ha de ser booleano'),

]

module.exports = { 
    contactIdNewValidation,
    contactIdDeleteValidation,
    contactSearchValidation
}
