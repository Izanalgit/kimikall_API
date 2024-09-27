const {dbFindUserLogIn} = require('../../services/userServices');
const {saveToken,findToken} = require('../../services/tokenServices');
const {genToken} = require('../../utils/jwtAuth');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {

    const payload = req.body.payload;

    //No payload check
    if(!payload)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadRequired});

    const {email,pswd} = payload;

    //Incorrect payload check
    if(!email || !pswd)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadIncorrect});

        
    //User check
    const user = await dbFindUserLogIn(email,pswd);
    if(!user)
        return res
            .status(401)
            .json({messageErr:msgErr.errCredentialsIncorrect});

    
    //Check if there is a token allready from the user
    const tokenSaved = await findToken (user._id);
    if(tokenSaved) 
        return res
            .status(409)
            .json({messageErr:msgErr.errSession(true)});
    
    //Generate token
    const token = genToken(user._id);
    const tokenDB = await saveToken(user._id,token);
    if(!tokenDB) return res
            .status(500)
            .json({messageErr:msgErr.errToken}); 

    console.log('SESSION UPDATED - LOGIN : ',user.name);

    res
        .status(200)
        .set('Authorization',token)
        .json({
            user:user.name,
            message:'Succes on login!'
        })

}