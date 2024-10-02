const {getBlockedUser} = require('../../services/privacyServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;

    try {
        const blockedUsers = await getBlockedUser(userId);

        if(!blockedUsers)
            return res
                .status(200)
                .json({message: 'There is not blocked users'});
    
        return res
            .status(200)
            .json({blockedUsers});
    
    } catch (err) {
        msgErr.errConsole(userId,'GET BLOCK LIST', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
    
};