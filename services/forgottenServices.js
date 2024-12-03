const ForgottenPasword = require('../models/ForgottenPasword');

const {genHexKey} = require('../utils/keysCrypto');

//Create
async function dbCreateForgotten(userId){
    try{
        //Check previous doc and deleted it
        const previDoc = await ForgottenPasword.findOne({userId});
        if(previDoc)
            await ForgottenPasword.findByIdAndDelete(previDoc._id);

        const key = genHexKey(6);

        const newDoc = await ForgottenPasword.create({userId,key});
        return newDoc;

    }catch (err){
        console.error('ERROR : DB-CREATE FORGOTTEN PASS DOC : ',err);
        throw new Error ('can not create new forgotten password document');
    }
}

//Find by key
async function dbFindForgotten(userId,forgottenKey){
    try{
        const forgotten = await ForgottenPasword.findOne({userId,key:forgottenKey});
        return forgotten;
    }catch (err){
        console.error('ERROR : DB-FIND FORGOTTEN PASS DOC BY KEY : ',err);
        throw new Error ('invalid verification forgotten password key');
    }
}

//Delete by id
async function dbDeleteForgotten(id){
    try{
        const delDoc = await ForgottenPasword.findByIdAndDelete(id);
        return delDoc;
    }catch (err){
        console.error('ERROR : DB-DELETE FORGOTTEN PASS DOC BY ID : ',err);
        throw new Error ('can not delete forgotten password document');
    }
}

module.exports = {
    dbCreateForgotten,
    dbFindForgotten,
    dbDeleteForgotten
}