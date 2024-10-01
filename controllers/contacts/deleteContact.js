const {removeContactUser} = require('../../services/contactsServices');
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

        return res
            .status(200)
            .json({message:'User contact removed successfully'});

    }catch(err){
        console.error('ERROR : REMOVE CONTACT : ',err)
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }    
};