const {dbCreatePreUser, dbDeletePreUser} = require('../../services/preUserServices');
const {sendVerificationEmail} = require('../../services/mailSenderServices');
const {passHasher} = require('../../utils/passwordHasher');
const {dbFindUser} = require('../../services/userServices')
const {msgErr} = require('../../utils/errorsMessages');

module.exports =async (req,res)=>{
    
    const payload = req.body.payload

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

    //Allready user check
    const allreadyUser = await dbFindUser(email);
    if(allreadyUser)
        return res
            .status(400)
            .json({messageErr:msgErr.errGeneral('User allready created')});

    try{       
        
        //Create pre user
        const hashedPaswd = await passHasher(pswd); //hash user password
        const newUser = await dbCreatePreUser({name,email,pswd:hashedPaswd});

        //Send verification mail to user
        const newUserKey = newUser.key;
   
        const verificationEmailSended = await sendVerificationEmail(email,newUserKey);

        if(verificationEmailSended)
            return res
                .status(200)
                .json({message:'Revisa tu correo electrónico.'});
        
        else
            await dbDeletePreUser(newUser._id);
            msgErr.errConsole('PRE USER','SEND EMAIL');
            return res
                .status(500)
                .json({messageErr:msgErr.errGeneral('when send email')});
        

    }catch(err){
        msgErr.errConsole('NEW USER','CREATE USER', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
        
};