const { validationResult } = require('express-validator');

//Validator Result Middleware -> put last of validator middlewares 

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) 
        return res
            .status(422)
            .json({ errors: errors.array() })
	next();
}

module.exports = {validate};