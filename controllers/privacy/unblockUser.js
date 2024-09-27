const {removeBlockedUser} = require('../../services/privacyServices');
const {dbFindUser} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

    //No payload
    if(!payload)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadRequired});

    const {unblockUser} = payload;

    //Incorrect payload
    if(!unblockUser)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadIncorrect});

    //User to unblock get ID
    const unblockUserObj = await dbFindUser(unblockUser);

    if(!unblockUserObj) 
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound('Unblock')});
     
    const unblockId = unblockUserObj._id;

    //Unblock user  
    try{
        await removeBlockedUser(userId,unblockId);
    }catch(err){
        return res
            .status(401)
            .json({messageErr:err});
    }

    return res
        .status(200)
        .json({message:'User unblocked successfully'});
    
};