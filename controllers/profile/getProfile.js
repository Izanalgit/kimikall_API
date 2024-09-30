const {dbFindProfile} = require('../../services/profileServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;

    //Get profile user
    const userProfile = await dbFindProfile(userId);

    if(!userProfile) 
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound('Profile')})

    return res
        .status(200)
        .json({ userProfile });
    
};