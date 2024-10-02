const {dbFindProfile,dbUpdateProfile} = require('../../services/profileServices');
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

        const {bio,special} = payload;

        //Incorrect payload
        if(!bio && !special)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});


        //Get profile user
        const userProfile = await dbFindProfile(userId);

        if(!userProfile) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Profile')});

        //Update user profile
        userProfile.special = special;  //Take atention if can it delete with [] !! 
        userProfile.bio = bio;

        const updatedProfile = await dbUpdateProfile(userId,userProfile);
        
        return res
            .status(200)
            .json({ message: 'Profile updated successfully', updatedProfile });
        
    }catch(err){
        msgErr.errConsole(userId,'UPDATE PROFILE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
    
};