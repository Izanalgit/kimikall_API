const {addBlockedUser} = require('../../services/privacyServices');
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

        const {blockUser} = payload;

        //Incorrect payload
        if(!blockUser)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //User to block check ID
        const blockUserObj = await dbFindUserId(blockUser);

        if(!blockUserObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Block')})
        
        const blockId = blockUserObj._id;

        //Block user  
        await addBlockedUser(userId,blockId);

        return res
            .status(200)
            .json({message:'User blocked successfully'});


    }catch (err) {
        msgErr.errConsole(userId,'BLOCK USER', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};