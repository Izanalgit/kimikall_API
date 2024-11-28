const crypto = require('crypto');


// Pair keys generation
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });
    
    return { 
        publicKey: publicKey.export({ type: 'pkcs1', format: 'pem' }), 
        privateKey: privateKey.export({ type: 'pkcs1', format: 'pem' }) };
}

// Encription key derive
function deriveEncryptionKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

// Random password generation
function randomPassword() {
    return crypto.randomBytes(16).toString('hex');
}


// Private key encrypt
function encryptPrivateKey(privateKey, userPassword) {

    const password = userPassword
        ? userPassword
        : randomPassword();

    const salt = crypto.randomBytes(16).toString('hex');
    const iv = crypto.randomBytes(16);

    const encryptionKey = deriveEncryptionKey(password, salt);
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    if(userPassword)
        return { encryptedPrivateKey: encrypted, iv: iv.toString('hex'), salt };
    else
        return { 
            reEncryptedPrivateKey: encrypted, 
            reEncryptedPrivateKeyPassword:password,
            reIv: iv.toString('hex'), 
            reSalt: salt 
        };  
}

// Private key decrypt
function decryptPrivateKey(password,keyData) {

    const encryptionKey = deriveEncryptionKey(password, keyData.salt);
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, Buffer.from(keyData.iv, 'hex'));
    
    let decrypted = decipher.update(keyData.encryptedPrivateKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {generateKeyPair,encryptPrivateKey,decryptPrivateKey}