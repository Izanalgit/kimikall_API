const {addMessageToken,addPremiumToken} = require('../../services/premyServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const tokenType = req.params.tokenType;

    let tokenAdded = false;

    try {
        //Incorrect parameters
        if(!tokenType)
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});

        if(tokenType === "premy")
            tokenAdded = await addPremiumToken(userId);
        
        if(tokenType === "message")
            tokenAdded = await addMessageToken(userId);
            tokenAdded = await addMessageToken(userId);
            tokenAdded = await addMessageToken(userId);
            tokenAdded = await addMessageToken(userId);
            tokenAdded = await addMessageToken(userId);
    
        if(tokenAdded)
            return res.status(200);
        else
            throw new Error('false value on tokenAdded')
    
    } catch (err) {
        msgErr.errConsole(userId,'PROVISIONAL ADD PREMY TOKENS', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('premy tokens not added')});
    }
    
};