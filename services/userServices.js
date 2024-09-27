const {passCompare} = require('../utils/passwordHasher');
const User = require('../models/User');

//Create
async function dbCreateUser(user){
    try{
        const newUser = await User.create({...user});
        return newUser;
    }catch (err){
        console.error('DB-CREATE USER ERROR : ',err);
        throw new Error ('ERROR : can not create new user');
    }
}

//Find all
async function dbFindUsers(){
    try{
        const allUser = await User.find();
        return allUser;
    }catch (err){
        console.error('DB-FIND USERS ERROR : ',err);
        throw new Error ('ERROR : can not find users');
    }
}

//Find by id
async function dbFindUserId(id){
    try{
        const user = await User.findById(id);
        return user;
    }catch (err){
        console.error('DB-FIND USER BY ID ERROR : ',err);
        throw new Error ('ERROR : can not find that user');
    }
}

//Find by email
async function dbFindUser(userEmail){
    try{
        const user = await User.findOne({email:userEmail});
        return user;
    }catch (err){
        console.error('DB-FIND USER BY EMAIL ERROR : ',err);
        throw new Error ('ERROR : can not find that user');
    }
}

//Find by login
async function dbFindUserLogIn(userEmail,password){
    try{
        const user = await User.findOne({email:userEmail});
        const comparePswd = await passCompare(password, user.pswd);

        if(comparePswd)
            return user;
        
    }catch (err){
        console.error('DB-FIND USER BY LOGIN ERROR : ',err);
        throw new Error ('ERROR : can not find that user');
    }
}

//Update by id
async function dbUpdateUser(id,user){
    try{
        const updtUser = await User.findByIdAndUpdate(id,user,{new:true});
        return updtUser;
    }catch (err){
        console.error('DB-UPDATE USER BY ID ERROR : ',err);
        throw new Error ('ERROR : can not update that user');
    }
}

//Delete by id
async function dbDeleteUser(id){
    try{
        const delUser = await User.findByIdAndDelete(id);
        return delUser;
    }catch (err){
        console.error('DB-DELETE USER BY ID ERROR : ',err);
        throw new Error ('ERROR : can not delete that user');
    }
}

module.exports = {
    dbCreateUser,
    dbFindUsers,
    dbFindUserId,
    dbFindUser,
    dbFindUserLogIn,
    dbUpdateUser,
    dbDeleteUser
}