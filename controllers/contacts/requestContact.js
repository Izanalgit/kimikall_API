const {addSolicitationContact} = require('../../services/contactsServices');
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

        const {newContact} = payload;

        //Incorrect payload
        if(!newContact)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //User to add check ID
        const newContactObj = await dbFindUserId(newContact);

        if(!newContactObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('New Contact')})
        
        const newContactId = newContactObj._id;

        //Send request to contact  
        await addSolicitationContact(userId,newContactId);

        return res
            .status(200)
            .json({message:'User request sended successfully'});

    }catch (err) {
        msgErr.errConsole(userId,'ADD NEW CONTACT REQUEST', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};