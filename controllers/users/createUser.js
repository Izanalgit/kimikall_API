const {dbCreateUser} = require('../../services/userServices');
const {dbCreateProfile,dbDeleteProfile} = require('../../services/profileServices');
const {dbCreateProfileExtended,dbDeleteProfileExtended} = require('../../services/profileExtendedServices');
const {dbCreateContactDocument,deleteContactList} = require('../../services/contactsServices');
const {passHasher} = require('../../utils/passwordHasher');
const {msgErr} = require('../../utils/errorsMessages');

module.exports =async (req,res)=>{
    
    const payload = req.body.payload;

    try{       

        //Logued check
        const sessionToken = req.user; 
        if(sessionToken)
            return res
                .status(409)
                .json({messageErr:msgErr.errSession(true)})

        //No payload check
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {name,email,pswd} = payload;

        //Incorrect payload check
        if(!name || !email || !pswd)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});
        
        //Create new user  -------------------------- IMPROVE AND REFACT !!!
    
        const hashedPaswd = await passHasher(pswd); //hash user password
        const newUser = await dbCreateUser({name,email,pswd:hashedPaswd});

        const newUserId = newUser._id;
        const newProfile = await dbCreateProfile(newUserId);
        const newProfileExtended = await dbCreateProfileExtended(newUserId);
        const newContactsDoc = await dbCreateContactDocument(newUserId);

        //Check created user ---------------- IMPROVE -> EMAIL VERIFY TO COMPLETE PROFILE !!!
        
        //Deletes malformed user docs -------------------------- IMPROVE AND REFACT !!!
        if(!newProfile || !newContactsDoc || !newProfileExtended){
            if(newProfile) await dbDeleteProfile(newUserId);
            if(newContactsDoc) await deleteContactList(newUserId);
            if(newProfileExtended) await dbDeleteProfileExtended(newUserId);
            
            return res
                .status(500)
                .json({messageErr:msgErr.errApiInternal});
        }

        return res
            .status(201)
            .json({name:newUser.name,email:newUser.email});

    }catch(err){
        msgErr.errConsole('NEW USER','CREATE USER', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
        
};