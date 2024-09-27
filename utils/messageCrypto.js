const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.KEY_SECRET, 'hex');

//Encrypter
function encryptText(data){
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm,key,iv);
    
    let encrypted = cipher.update(data,'utf8','hex');
    encrypted += cipher.final('hex');

    return {encryptedData: encrypted, iv: iv.toString('hex')};
}

//Decrypter
function decryptText(encryptedData, ivHex){

    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {encryptText, decryptText};