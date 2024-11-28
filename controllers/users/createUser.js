const {dbFindPreUser, dbDeletePreUser} = require('../../services/preUserServices');
const {dbCreateUser, dbDeleteUser} = require('../../services/userServices');
const {dbCreateProfile,dbDeleteProfile} = require('../../services/profileServices');
const {dbCreateProfileExtended,dbDeleteProfileExtended} = require('../../services/profileExtendedServices');
const {dbCreateContactDocument,deleteContactList} = require('../../services/contactsServices');
const {dbCreatePremyDocument,dbDeletePremyDocument} = require('../../services/premyServices');
const {dbCreateKeyDocument,dbDeleteKeyDocument} = require('../../services/pairKeyServices');
const {passHasher} = require('../../utils/passwordHasher');
const {msgErr} = require('../../utils/errorsMessages');

module.exports =async (req,res)=>{
    
    const userKey = req.params.userKey;

    try{       

        //No params check
        if(!userKey)
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});

        //Check key
        const preUser = await dbFindPreUser(userKey);
        await dbDeletePreUser(preUser._id);

        //Create new user 
        const name = preUser.name;
        const email = preUser.email;
        const pswd = preUser.pswd;

        const hashedPaswd = await passHasher(pswd); //hash user password
        const newUser = await dbCreateUser({name,email,pswd:hashedPaswd});
        const newUserId = newUser._id;

        const newProfile = dbCreateProfile(newUserId);
        const newProfileExtended = dbCreateProfileExtended(newUserId);
        const newContactsDoc = dbCreateContactDocument(newUserId);
        const newPremyDoc = dbCreatePremyDocument(newUserId);
        const newKeysDoc = dbCreateKeyDocument(newUserId,pswd);


        try {
            await Promise.all([
                newProfile,
                newProfileExtended,
                newContactsDoc,
                newPremyDoc,
                newKeysDoc
            ]);
        } catch (err) {
            msgErr.errConsole('NEW USER','CREATE USER DOCUMENTS', err);

            // Rollback
            try {
                await dbDeleteKeyDocument(newUserId);
                console.log('Rollback: Keys document deleted');
            } catch (error) {
                msgErr.errConsole('NEW USER','DELETE KEYS DOC', error);
            } 
            try {
                await dbDeletePremyDocument(newUserId);
                console.log('Rollback: Premy document deleted');
            } catch (error) {
                msgErr.errConsole('NEW USER','DELETE PREMY DOC', error);
            }
            try {
                await deleteContactList(newUserId);
                console.log('Rollback: Contacts document deleted');
            } catch (error) {
                msgErr.errConsole('NEW USER','DELETE CONTACTS DOC', error);
            }
            try {
                await dbDeleteProfileExtended(newUserId);
                console.log('Rollback: Profile Extended document deleted');
            } catch (error) {
                msgErr.errConsole('NEW USER','DELETE PROFILE EXT DOC', error);
            }
            try {
                await dbDeleteProfile(newUserId);
                console.log('Rollback: Profile document deleted');
            } catch (error) {
                msgErr.errConsole('NEW USER','DELETE PROFILE DOC', error);
            }
            try {
                await dbDeleteUser(newUserId);
                console.log('Rollback: User document deleted');
            } catch (error) {
                msgErr.errConsole('NEW USER','DELETE USER DOC', error);
            }

            throw new Error('when creating user documents');
        }

        return res
            .status(201)
            .json({name:newUser.name,email:newUser.email});

    }catch(err){
        msgErr.errConsole('NEW USER','CREATE USER', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
        
};