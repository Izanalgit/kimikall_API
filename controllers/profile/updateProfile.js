const {dbFindProfile,dbUpdateProfile} = require('../../services/profileServices');
const {dbFindProfileExtended,dbUpdateProfileExtended} = require('../../services/profileExtendedServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;
    
    try{

        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {profile,extended} = payload;

        //Incorrect payload
        if(!profile && !extended)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});


        //Get profile user
        const userProfile = await dbFindProfile(userId);
        const userProfileExtended = await dbFindProfileExtended(userId);

        if(!userProfile || !userProfileExtended) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Profile')});

        //Update user profile
        Object.assign(userProfile,profile);
        Object.assign(userProfileExtended,extended);

        const updatedProfile = await dbUpdateProfile(userId,userProfile);
        const updatedProfileExtended = await dbUpdateProfileExtended(userId,userProfileExtended);       
        
        return res
            .status(200)
            .json({ 
                message: 'Profile updated successfully', 
                updatedProfile ,
                updatedProfileExtended
            });
        
    }catch(err){
        msgErr.errConsole(userId,'UPDATE PROFILE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
    
};