const {dbFindUser,dbUpdateUser} = require('../../services/userServices');
const {updatePublicKeyOnContacts} = require('../../services/contactsServices');
const {dbUpdateKeyDocument} = require('../../services/pairKeyServices');
const {dbFindForgotten,dbDeleteForgotten} = require('../../services/forgottenServices');
const {passHasher} = require('../../utils/passwordHasher');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const payload = req.body.payload;
    let user;

    try{

        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {recoverKey,pswd,email} = payload;

        //Incorrect payload
        if(!recoverKey || !pswd || !email)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //Find user
        user = await dbFindUser(email);
        const userId = user._id;

        //Check recover key
        const recoverKeyDoc = await dbFindForgotten(userId,recoverKey);

        if(recoverKeyDoc && (recoverKeyDoc.userId).toString() === (userId).toString()){
            // Hash new pass
            const hashedPaswd = await passHasher(pswd) ;

            // DB updates
            await dbUpdateUser(userId,{pswd: hashedPaswd});

            // Change private key and update contacts docs
            await dbUpdateKeyDocument(userId,pswd);
            await updatePublicKeyOnContacts(userId);

            // Delete forgotten pass doc
            await dbDeleteForgotten(recoverKeyDoc._id);
        }else
            return res
                .status(401)
                .json({messageErr:msgErr.errCredentialsIncorrect});
        
        return res
            .status(200)
            .json({message:'New password changed'});

    }catch(err){
        msgErr.errConsole('UNKNOWN','RECOVER ACOUNT', err);

        //User check
        if(!user)
            return res
                .status(401)
                .json({messageErr:msgErr.errCredentialsIncorrect});

        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
};