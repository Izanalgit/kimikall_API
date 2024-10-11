const {dbFindPreUser, dbDeletePreUser} = require('../../services/preUserServices');
const {dbCreateUser, dbDeleteUser} = require('../../services/userServices');
const {dbCreateProfile,dbDeleteProfile} = require('../../services/profileServices');
const {dbCreateProfileExtended,dbDeleteProfileExtended} = require('../../services/profileExtendedServices');
const {dbCreateContactDocument,deleteContactList} = require('../../services/contactsServices');
const {dbCreatePremyDocument,dbDeletePremyDocument} = require('../../services/premyServices');
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

        const newUser = await dbCreateUser({name,email,pswd});
        const newUserId = newUser._id;

        const newProfile = dbCreateProfile(newUserId);
        const newProfileExtended = dbCreateProfileExtended(newUserId);
        const newContactsDoc = dbCreateContactDocument(newUserId);
        const newPremyDoc = dbCreatePremyDocument(newUserId);

        let profileCreated,profileExtendedCreated,contactsDocCreated,premyDocCreated;

        try{
            [
                profileCreated, 
                profileExtendedCreated, 
                contactsDocCreated,
                premyDocCreated
            ] = await Promise.all([
                newProfile,
                newProfileExtended,
                newContactsDoc,
                newPremyDoc
            ]);
        }catch(err){
            //Rollback if somethings fails
            await dbDeleteUser (newUserId);
            
            if(profileCreated) await dbDeleteProfile(newUserId);
            else msgErr.errConsole('PRE USER','CREATION USER','new profile doc');

            if(profileExtendedCreated) await deleteContactList(newUserId);
            else msgErr.errConsole('PRE USER','CREATION USER','new extended profile doc');
             
            if(contactsDocCreated) await dbDeleteProfileExtended(newUserId);
            else msgErr.errConsole('PRE USER','CREATION USER','new contacts doc');

            if(premyDocCreated) await dbDeletePremyDocument(newUserId);
            else msgErr.errConsole('PRE USER','CREATION USER','new premy doc');

            throw new Error('user creation documents');
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