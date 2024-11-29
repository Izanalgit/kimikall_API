const {dbFindUserLogIn} = require('../../services/userServices');
const {setPrivateKey} = require('../../services/pairKeyServices');
const {saveToken,findToken} = require('../../services/tokenServices');
const {genToken} = require('../../utils/jwtAuth');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const payload = req.body.payload;
    const {email,pswd} = payload;
    let user;
    let tokenSaved;
    let tokenDB;

    try{

        //No payload check
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});
        
        //Incorrect payload check
        if(!email || !pswd)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //Find user
        user = await dbFindUserLogIn(email,pswd);
        
        //Check if there is a token allready from the user
        tokenSaved = await findToken (user._id);
        if(tokenSaved) 
            return res
                .status(409)
                .json({messageErr:msgErr.errSession(true)});
        
        //Generate token
        const token = genToken(user._id);
        tokenDB = await saveToken(user._id,token);

        //Generate private key
        const keys = await setPrivateKey(user._id,pswd)
        
        //Return 200 and headers
        return res
            .status(200)
            .set('Authorization',token)
            .json({
                user:user.name,
                soloElPuebloSalvaAlPueblo:{
                    public:keys.publicKey,
                    rpk:keys.reEncryptedPrivateKey,
                    rps:keys.reEncryptedPrivateKeyPassword,
                    riv:keys.reIv,
                    rsa:keys.reSalt
                },
                message:'Succes on login!'
            })

    }catch(err){
        msgErr.errConsole('A USER','LOG IN ACOUNT', err);

        //User check
        if(!user)
            return res
                .status(401)
                .json({messageErr:msgErr.errCredentialsIncorrect});

        //Generate token check
        if(!tokenDB)
             return res
                .status(500)
                .json({messageErr:msgErr.errToken}); 

        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
}