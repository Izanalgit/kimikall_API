const {addMessageToken,addPremiumToken} = require('../../services/premyServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const tokenType = req.params.tokenType;

    try {
        //Incorrect parameters
        if(!tokenType || !["premy","message"].includes(tokenType))
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});

        if(tokenType === "premy")
            await addPremiumToken(userId);
        
        if(tokenType === "message")
            await addMessageToken(userId);
            await addMessageToken(userId);
    

        return res
            .status(200)
            .json({message:'Completed purchase'});

    
    } catch (err) {
        msgErr.errConsole(userId,'PROVISIONAL ADD PREMY TOKENS', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('premy tokens not added')});
    }
    
};