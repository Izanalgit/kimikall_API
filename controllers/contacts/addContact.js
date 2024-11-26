const {addContactUser,declineContactUser} = require('../../services/contactsServices');
const {dbFindUserId} = require('../../services/userServices');
const {sendFriendAccept} = require('../../websockets/events');
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

        const {newContact,decline} = payload;

        //Incorrect payload
        if(!newContact)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //User to add check ID
        newContactObj = await dbFindUserId(newContact);

        const newContactId = newContactObj._id;
        
        //Decline contact user
        if(decline){ 
            await declineContactUser(userId,newContactId);

            return res
                .status(200)
                .json({message:'User contact request declined successfully'});
        }

        //Add contact user  
        await addContactUser(userId,newContactId);

        //WS Notify        
        sendFriendAccept(connections,userId,newContactId);

        return res
            .status(200)
            .json({message:'User added successfully to contacts'});

    }catch (err) {
        msgErr.errConsole(userId,'ADD CONTACT', err);

        if(!newContactObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('New Contact')})

        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};