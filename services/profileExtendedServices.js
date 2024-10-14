const ProfileExtended = require('../models/ProfileExtended');

//Create
async function dbCreateProfileExtended(userId){
    try{
        const newProfile = await ProfileExtended.create({userId});
        return newProfile;
    }catch (err){
        console.error('ERROR : DB-CREATE EXTENDED PROFILE: ',err);
        throw new Error ('can not create new extended profile');
    }
}

//Find by id
async function dbFindProfileExtendedId(id){
    try{
        const profile = await ProfileExtended.findById(id);
        return profile;
    }catch (err){
        console.error('ERROR : DB-FIND EXTENDED PROFILE : ',err);
        throw new Error ('can not find that extended profile');
    }
}

//Find by user
async function dbFindProfileExtended(userId){
    try{
        const profile = await ProfileExtended.findOne({userId},'-userId');
        return profile;
    }catch (err){
        console.error('ERROR : DB-FIND EXTENDED PROFILE BY USER ID : ',err);
        throw new Error ('can not find that extended profile');
    }
}

//Update by user id
async function dbUpdateProfileExtended(userId,profile){
    try{
        const updtProfile = await ProfileExtended.findOneAndUpdate({userId}, profile, {new: true});
        return updtProfile;
    }catch (err){
        console.error('ERROR : DB-UPDATE EXTENDED PROFILE : ',err);
        throw new Error ('can not update that extended profile');
    }
}

//Delete by user id
async function dbDeleteProfileExtended(userId){
    try{
        const delProfile = await ProfileExtended.findOneAndDelete({ userId });
        return delProfile;
    }catch (err){
        console.error('ERROR : DB-DELETE EXTENDED PROFILE : ',err);
        throw new Error ('can not delete that extended profile');
    }
}

module.exports = {
    dbCreateProfileExtended,
    dbFindProfileExtendedId,
    dbFindProfileExtended,
    dbUpdateProfileExtended,
    dbDeleteProfileExtended
}