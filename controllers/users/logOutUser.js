const {cleanToken,findToken} = require('../../services/tokenServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {

    const userId = req.user;

    if(!userId)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadRequired});

    //User check
    const user = await dbFindUserId(userId);
    
    if(!user)
        return res
            .status(401)
            .json({messageErr:msgErr.errCredentialsIncorrect});

    //Check if there is a token from the user
    const tokenSaved = await findToken (userId);
    if(!tokenSaved) 
        return res
            .status(409)
            .json({messageErr:msgErr.errSession(false)});

    //Delete session token
    const tokenClean = await cleanToken (userId);
    if(!tokenClean) 
        return res
            .status(500)
            .json({messageErr:msgErr.errToken});

    console.log('SESSION UPDATED - LOGOUT : ', user.name);

    res
        .status(200)
        .json({
            message:'Succes on logout!'
        })

}