const {countMessageToken,countPremiumToken} = require('../../services/premyServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;

    try {

        const premiumTime = await countPremiumToken(userId);
        const premiumTokens = await countMessageToken(userId);
       
        return res
            .status(200)
            .json({
                premiumTime,
                premiumTokens
            });

    
    } catch (err) {
        msgErr.errConsole(userId,'COUNT PREMIUM AND TOKENS', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('premy count failed')});
    }
    
};