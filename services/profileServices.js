const Profile = require('../models/Profile');

//Create
async function dbCreateProfile(profile){
    try{
        const newProfile = await Profile.create({...profile});
        return newProfile;
    }catch (err){
        console.error('DB-CREATE PROFILE ERROR : ',err);
        throw new Error ('ERROR : can not create new profile');
    }
}

//Find by id
async function dbFindProfileId(id){
    try{
        const profile = await Profile.findById(id);
        return profile;
    }catch (err){
        console.error('DB-FIND PROFILE ERROR : ',err);
        throw new Error ('ERROR : can not find that profile');
    }
}

//Find by user
async function dbFindProfile(userId){
    try{
        const profile = await Profile.findOne({userId});
        return profile;
    }catch (err){
        console.error('DB-FIND PROFILE BY USER ID ERROR : ',err);
        throw new Error ('ERROR : can not find that profile');
    }
}

//Update by user id
async function dbUpdateProfile(userId,profile){
    try{
        const updtProfile = await Profile.findOneAndUpdate({userId}, profile, {new: true});
        return updtProfile;
    }catch (err){
        console.error('DB-UPDATE PROFILE ERROR : ',err);
        throw new Error ('ERROR : can not update that profile');
    }
}

//Delete by user id
async function dbDeleteProfile(userId){
    try{
        const delProfile = await Profile.findOneAndDelete({ userId });
        return delProfile;
    }catch (err){
        console.error('DB-DELETE PROFILE ERROR : ',err);
        throw new Error ('ERROR : can not delete that profile');
    }
}

module.exports = {
    dbCreateProfile,
    dbFindProfileId,
    dbFindProfile,
    dbUpdateProfile,
    dbDeleteProfile
}