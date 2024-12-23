const TokenCSRF = require('../models/TokenCSRF');
const {genCSRFToken} = require('../utils/jwtAuth');

//Save token
async function saveCSRFToken(userId){
    try{
        const {csrf, token:tokenCSRF} = genCSRFToken();
        const CSRFToken = await TokenCSRF.create({userId,csrf,tokenCSRF});
        return CSRFToken;
    }catch (err){
        console.error('ERROR : DB-SAVE CSRF TOKEN : ', err.errmsg);
        throw new Error ('can not save that CSRF token');
    }
}

//Find Token
async function findCSRFToken(userId){
    try{
        const CSRFToken = await TokenCSRF.findOne({userId});
        return CSRFToken;
    }catch (err){
        console.error('ERROR : DB-FIND CSRF TOKEN : ',err.errmsg);
        throw new Error ('can not find that CSRF token');
    }
}

//Clean Token
async function cleanCSRFToken(userId){
    try{
        await TokenCSRF.findOneAndDelete({userId});
        return true;
    }catch (err){
        console.error('ERROR : DB-CLEAN CSRF TOKEN : ', err.errmsg);
        throw new Error ('can not clean that CSRF token');
    }
}

module.exports = {findCSRFToken,saveCSRFToken,cleanCSRFToken};