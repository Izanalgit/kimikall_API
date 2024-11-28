const {cleanToken,findToken} = require('../../services/tokenServices');
const {dbCleanReKey} = require('../../services/pairKeyServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try{

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

        // Clean private re key pass
        await dbCleanReKey(userId);

        if(!tokenClean) 
            return res
                .status(500)
                .json({messageErr:msgErr.errToken});


        return res
            .status(200)
            .json({
                message:'Succes on logout!'
            })

    }catch(err){
        msgErr.errConsole(userId,'LOG OUT ACOUNT', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }

}