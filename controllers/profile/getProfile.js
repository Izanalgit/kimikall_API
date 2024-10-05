const {dbFindProfile} = require('../../services/profileServices');
const {dbFindProfileExtended} = require('../../services/profileExtendedServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try{

    //Get profile user
    const userProfile = await dbFindProfile(userId);
    const userProfileExtended = await dbFindProfileExtended(userId)

    if(!userProfile) 
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound('Profile')})

    return res
        .status(200)
        .json({ userProfile , userProfileExtended});

    } catch (err) {
        msgErr.errConsole(userId,'GET PROFILE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
};