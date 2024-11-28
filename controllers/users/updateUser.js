const {dbUpdateUser} = require('../../services/userServices');
const {passHasher} = require('../../utils/passwordHasher');
const {updateNameOnContacts,updatePublicKeyOnContacts} = require('../../services/contactsServices');
const {dbUpdateKeyDocument} = require('../../services/pairKeyServices');
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

        const {name,pswd} = payload;

        //Incorrect payload
        if(!name && !pswd || payload.email)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});


        const hashedPaswd = pswd ? await passHasher(pswd) : undefined ;

        const user = {
            ...(name && { name }),
            ...(hashedPaswd && { pswd: hashedPaswd })
        }

        //DB query
        const updtUser = await dbUpdateUser(userId,user);

        await updateNameOnContacts(userId,user.name);

        // Change private key and update contacts docs
        if(pswd){
            await dbUpdateKeyDocument(userId,pswd);
            await updatePublicKeyOnContacts(userId);
        }
        
        return res
            .status(200)
            .json({message:'User updated',name:updtUser.name});

    }catch(err){
        msgErr.errConsole(userId,'UPDATE ACOUNT', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
};