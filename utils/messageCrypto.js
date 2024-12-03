const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.KEY_SECRET, 'hex');

//Encrypter
function encryptText(data){
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm,key,iv);

    const messageUtf8 = Buffer.from(data, 'base64').toString('hex');

    let encrypted = cipher.update(messageUtf8,'hex','hex');
    encrypted += cipher.final('hex');

    return {encryptedData: encrypted, iv: iv.toString('hex')};
}

//Decrypter
function decryptText(encryptedData, ivHex){

    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'hex');
    decrypted += decipher.final('hex'); 

    const messageBase64 = Buffer.from(decrypted, 'hex').toString('base64');

    return messageBase64;
}

function validationMessageDecrypt(encryptedMessage, privateKey) {
        
    const bufferMessage = Buffer.from(encryptedMessage, 'base64');
    const decryptedMessage = crypto.privateDecrypt(privateKey, bufferMessage);
    
    return decryptedMessage.toString('utf8');
}

module.exports = {encryptText, decryptText, validationMessageDecrypt};