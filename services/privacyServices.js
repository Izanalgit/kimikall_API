const User = require('../models/User');

//Add user to blocked list
async function addBlockedUser (userId, blockUserId){
    try{
        await User.findByIdAndUpdate(userId,{
            $addToSet: {blockedUsers : blockUserId}
        })
    }catch (err){
        console.error('DB-BLOCK USERS ERROR : ',err);
        throw new Error ('ERROR : can not block that user');
    }
}

//Remove a blocked user from blocked list
async function removeBlockedUser (userId, blockUserId) {
    try{
        await User.findByIdAndUpdate(userId,{
            $pull: {blockedUsers : blockUserId}
        })
    }catch (err){
        console.error('DB-UNBLOCK USERS ERROR : ',err);
        throw new Error ('ERROR : can not unblock that user');
    }
}

//Get blocked users by user id
async function getBlockedUser(userId) {
    try{

        const user = await User.findById(userId)
            .select('blockedUsers')
            .populate('blockedUsers', 'email');

        return user.blockedUsers;

    }catch (err){
        console.error('DB-GET BLOCK USERS ERROR : ',err);
        throw new Error ('ERROR : can get blocked users');
    }
}

module.exports = {
    addBlockedUser,
    removeBlockedUser,
    getBlockedUser
}