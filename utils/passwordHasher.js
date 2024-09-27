const bcrypt = require('bcrypt');

async function passHasher(pswd) {
    const salt = 10;
    
    const hashedPaswd = await bcrypt.hash(pswd, salt);
    
    return hashedPaswd;
}

async function passCompare(plainPswd, hashedPswd) {
    
    const passComparsion = await bcrypt.compare(plainPswd, hashedPswd);
    
    return passComparsion;
}

module.exports = {passHasher,passCompare};