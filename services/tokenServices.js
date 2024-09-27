const Token = require('../models/Token');

//Save token
async function saveToken(userId,token){
    try{
        const authToken = await Token.create({userId,token});
        return authToken;
    }catch (err){
        console.error('DB-SAVE TOKEN ERROR : ', err.errmsg);
        throw new Error ('ERROR : can not save that token');
    }
}

//Find Token
async function findToken(userId){
    try{
        const authToken = await Token.findOne({userId});
        return authToken;
    }catch (err){
        console.error('DB-FIND TOKEN ERROR : ',err.errmsg);
        throw new Error ('ERROR : can not find that token');
    }
}

//Clean Token
async function cleanToken(userId){
    try{
        const authToken = await Token.findOneAndDelete({userId});
        return authToken;
    }catch (err){
        console.error('DB-CLEAN TOKEN ERROR : ', err.errmsg);
        throw new Error ('ERROR : can not clean that token');
    }
}

module.exports = {findToken,saveToken,cleanToken};