const {passCompare} = require('../utils/passwordHasher');
const User = require('../models/User');

//Create
async function dbCreateUser(user){
    try{
        const newUser = await User.create({...user});
        return newUser;
    }catch (err){
        console.error('ERROR : DB-CREATE USER : ',err);
        throw new Error ('can not create new user');
    }
}

//Find all
async function dbFindUsers(){
    try{
        const allUser = await User.find();
        return allUser;
    }catch (err){
        console.error('ERROR : DB-FIND USERS : ',err);
        throw new Error ('can not find users');
    }
}

//Find by id
async function dbFindUserId(id){
    try{
        const user = await User.findById(id);
        return user;
    }catch (err){
        console.error('ERROR : DB-FIND USER BY ID : ',err);
        throw new Error ('can not find that user');
    }
}

//Find by email
async function dbFindUser(userEmail){
    try{
        const user = await User.findOne({email:userEmail});
        return user;
    }catch (err){
        console.error('ERROR : DB-FIND USER BY EMAIL : ',err);
        throw new Error ('can not find that user');
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
        console.error('ERROR : DB-FIND USER BY LOGIN : ',err);
        throw new Error ('can not find that user');
    }
}

//Update by id
async function dbUpdateUser(id,user){
    try{
        const updtUser = await User.findByIdAndUpdate(id,user,{new:true});
        return updtUser;
    }catch (err){
        console.error('ERROR : DB-UPDATE USER BY ID : ',err);
        throw new Error ('can not update that user');
    }
}

//Delete by id
async function dbDeleteUser(id){
    try{
        const delUser = await User.findByIdAndDelete(id);
        return delUser;
    }catch (err){
        console.error('ERROR : DB-DELETE USER BY ID : ',err);
        throw new Error ('can not delete that user');
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