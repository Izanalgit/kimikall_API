const {addContactUser} = require('../../services/contactsServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    try{

        const userId = req.user;
        const payload = req.body.payload;

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

        //User to block check ID
        const newContactObj = await dbFindUserId(newContact);

        if(!newContactObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('New Contact')})
        
        const newContactId = newContactObj._id;

        //Add contact user  
        await addContactUser(userId,newContactId);

        return res
            .status(200)
            .json({message:'User added successfully'});

    }catch(err){
        console.error('ERROR : ADD CONTACT : ',err)
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }    
};