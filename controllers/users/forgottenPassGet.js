const {dbFindUser} = require('../../services/userServices');
const {dbCreateForgotten} = require('../../services/forgottenServices');
const {sendRecoverEmail} = require('../../services/mailSenderServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const payload = req.body.payload;
    const {email} = payload;

    let user;

    try{

        //No payload check
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});
        
        //Incorrect payload check
        if(!email)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //Find user
        user = await dbFindUser(email);

        //Generate recover key
        const {key} = await dbCreateForgotten(user._id)
        
        //Send recover email
        const recoverEmailSended = await sendRecoverEmail(email,key);

        if(recoverEmailSended)
            return res
                .status(200)
                .json({message:'Recover key sended'})

    }catch(err){
        msgErr.errConsole('A USER','LOG IN ACOUNT', err);

        //User check
        if(!user)
            return res
                .status(401)
                .json({messageErr:msgErr.errCredentialsIncorrect});

        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
}