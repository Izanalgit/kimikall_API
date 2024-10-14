const { body } = require('express-validator');

const strongPswd = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
}

const userValidation = [
	body('payload.name')
        .trim()
        .notEmpty()
        .withMessage('Nombre de usuario requerido')
        .isAlphanumeric() 
        .withMessage('El nombre debe ser alphanumerico')
        .isLength({ min: 3})
		.withMessage('El nombre debe ser de almenos 3 carácteres')
        .isLength({ max: 15})
		.withMessage('El nombre no debe superar los 15 caracteres'),
    body('payload.email')
        .trim()
        .notEmpty()
        .withMessage('Email de usuario requerido')
        .isEmail()
        .withMessage('Debe ser un email válido'),
	body('payload.pswd')
        .trim()
        .notEmpty()
		.withMessage('Una contraseña es requerida')
        // .isStrongPassword(strongPswd)
        // .withMessage('Debe ser una contraseña fuerte')
]
const userUpdateValidation = [
	body('payload.name')
        .trim()
        .isAlphanumeric() 
        .withMessage('El nombre debe ser alphanumerico')
        .isLength({ min: 3})
		.withMessage('El nombre debe ser de almenos 3 carácteres')
        .isLength({ max: 15})
		.withMessage('El nombre no debe superar los 15 caracteres'),
	// body('payload.pswd')
    //     .trim()
    //     .isStrongPassword(strongPswd)
    //     .withMessage('Debe ser una contraseña fuerte')
]
const credentialsValidation = [
    body('payload.email')
        .trim()
        .notEmpty()
        .withMessage('Email de usuario requerido')
        .isEmail()
        .withMessage('Debe ser un email válido'),
	body('payload.pswd')
        .trim()
        .notEmpty()
		.withMessage('Contraseña requerida')
]

module.exports = { 
    userValidation,
    userUpdateValidation,
    credentialsValidation
}