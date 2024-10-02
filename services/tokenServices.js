const Token = require('../models/Token');

//Save token
async function saveToken(userId,token){
    try{
        const authToken = await Token.create({userId,token});
        return authToken;
    }catch (err){
        console.error('ERROR : DB-SAVE TOKEN : ', err.errmsg);
        throw new Error ('can not save that token');
    }
}

//Find Token
async function findToken(userId){
    try{
        const authToken = await Token.findOne({userId});
        return authToken;
    }catch (err){
        console.error('ERROR : DB-FIND TOKEN : ',err.errmsg);
        throw new Error ('can not find that token');
    }
}

//Clean Token
async function cleanToken(userId){
    try{
        const authToken = await Token.findOneAndDelete({userId});
        return authToken;
    }catch (err){
        console.error('ERROR : DB-CLEAN TOKEN : ', err.errmsg);
        throw new Error ('can not clean that token');
    }
}

module.exports = {findToken,saveToken,cleanToken};