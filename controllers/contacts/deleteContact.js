const {removeContactUser} = require('../../services/contactsServices');
const {dbFindUserId} = require('../../services/userServices');
const {sendFriendRemoved} = require('../../websockets/events');
const connections = require('../../websockets/connections');
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

        const {removeContact} = payload;

        //Incorrect payload
        if(!removeContact)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //User to remove from contacts check ID
        const removeContactObj = await dbFindUserId(removeContact);

        if(!removeContactObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Contact')})
        
        const removeContactId = removeContactObj._id;

        //Remove contact user  
        await removeContactUser(userId,removeContactId);

        //WS Notify        
        sendFriendRemoved(connections,userId,removeContactId);

        return res
            .status(200)
            .json({message:'User contact removed successfully'});

    }catch (err) {
        msgErr.errConsole(userId,'DELETE CONTACT', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};