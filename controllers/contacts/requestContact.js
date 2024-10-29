const {addSolicitationContact,addContactUser,contactRequestCheck} = require('../../services/contactsServices');
const {dbFindUserId} = require('../../services/userServices');
const {sendFriendRequest} = require('../../websockets/events');
const connections = require('../../websockets/connections');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

    let newContactObj;

    try{

        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {newContact} = payload;

        //Incorrect payload
        if(!newContact)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        newContactObj = await dbFindUserId(newContact);        
        const newContactId = newContactObj._id;

        //Send request to contact or accept match
        const alreadyRequest = await contactRequestCheck(newContactId,userId);
        if (alreadyRequest)
            await addContactUser(userId,newContactId);
        else
            await addSolicitationContact(userId,newContactId);

        //WebSockete notify
        sendFriendRequest(connections, userId, newContactId);

        return res
            .status(200)
            .json({message:'User request sended successfully'});

    }catch (err) {
        msgErr.errConsole(userId,'ADD NEW CONTACT REQUEST', err);

        //User to add check ID
        if(!newContactObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('New Contact')})

        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};