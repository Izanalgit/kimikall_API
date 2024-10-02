const {dbFindProfile} = require('../../services/profileServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try{

    //Get profile user
    const userProfile = await dbFindProfile(userId);

    if(!userProfile) 
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound('Profile')})

    return res
        .status(200)
        .json({ userProfile });

    } catch (err) {
        msgErr.errConsole(userId,'GET PROFILE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
};