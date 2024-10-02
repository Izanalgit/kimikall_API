const {removeBlockedUser} = require('../../services/privacyServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;
    
    try{

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

        //User to unblock check ID
        const unblockUserObj = await dbFindUserId(unblockUser);

        if(!unblockUserObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Unblock')});
        
        const unblockId = unblockUserObj._id;

        //Unblock user  
        await removeBlockedUser(userId,unblockId);

        return res
            .status(200)
            .json({message:'User unblocked successfully'});

    }catch(err){
        msgErr.errConsole(userId,'UNBLOCK USER', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
    
};