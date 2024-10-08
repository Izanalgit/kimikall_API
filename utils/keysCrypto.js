const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const jwt_key = process.env.EMAIL_JWT_SECRET;

const genHexKey = (lenght) => crypto.randomBytes(lenght).toString('hex');

const genVerificationToken = (email,key) => {

    const token = jwt.sign({ email, key },jwt_key,{ expiresIn: '1h' });
    
    return token;
};

const verifyVerificationToken = (token) => {

    try {
        const decoded = jwt.verify(token, 'secreto');
        
        return {
            email : decoded.email,
            key : decoded.key
        }

    } catch (err) {
        console.error('ERROR : DB-DECODE VERIFICATION TOKEN : ',err.errmsg); //maybe bad reference (error.message)?
        throw new Error ('error when decoding token : ',err.errmsg);
    }
}

module.exports = {
    genHexKey,
    genVerificationToken,
    verifyVerificationToken
}