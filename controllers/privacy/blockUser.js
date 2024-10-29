const {addBlockedUser} = require('../../services/privacyServices');
const {dbFindUserId} = require('../../services/userServices');
const {contactCheck,contactRequestCheck,declineContactUser,removeContactUser} = require('../../services/contactsServices')
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

    let blockUserObj;

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
        
        blockUserObj = await dbFindUserId(blockUser);
        const blockId = blockUserObj._id;

        //Block user  
        await addBlockedUser(userId,blockId);

        //Contact remove if are contacts
        const areContacts = await contactCheck(userId,blockId);
        if(areContacts)
            await removeContactUser(userId,blockId);
        //Request remove if request
        const isRequest = await contactRequestCheck(blockId,userId);
        if(isRequest)
            await declineContactUser(userId,blockId);

        return res
            .status(200)
            .json({message:'User blocked successfully'});


    }catch (err) {
        msgErr.errConsole(userId,'BLOCK USER', err);

        //User to block check ID
        if(!blockUserObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Block')})

        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};