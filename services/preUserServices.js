const PreUser = require('../models/PreUser');

const {genHexKey} = require('../utils/keysCrypto');

//Create
async function dbCreatePreUser(user){
    try{
        const key = genHexKey(32);

        const newUser = await PreUser.create({...user,key});
        return newUser;

    }catch (err){
        console.error('ERROR : DB-CREATE PRE USER : ',err);
        throw new Error ('can not create new pre user');
    }
}

//Find by email
async function dbFindPreUser(preUserEmail){
    try{
        const user = await PreUser.findOne({email:preUserEmail});
        return user;
    }catch (err){
        console.error('ERROR : DB-FIND PRE USER BY EMAIL : ',err);
        throw new Error ('can not find that credentials');
    }
}

//Delete by id
async function dbDeletePreUser(id){
    try{
        const delUser = await PreUser.findByIdAndDelete(id);
        return delUser;
    }catch (err){
        console.error('ERROR : DB-DELETE PRE USER BY ID : ',err);
        throw new Error ('can not delete that pre user');
    }
}

module.exports = {
    dbCreatePreUser,
    dbFindPreUser,
    dbDeletePreUser
}