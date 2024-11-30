const {dbFindProfile,dbUpdateProfile} = require('../../services/profileServices');
const {deleteImage} = require('../../services/imagesServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const imageType = req.params.imageType;

    try {

        //Incorrect parameter
        if(imageType !== 'profile' && imageType !== 'cover')
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});


        //Check and get user profile
        const profile = await dbFindProfile(userId);
        if(!profile)
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Profile')})


        //Image delete

        //PROFILE IMAGE
        if (imageType === 'profile') {
            console.log("PROFILE ID : ",profile.profilePictureId)//CHIVATO
            // Check if previous image uploaded and delete it
            if (profile.profilePictureId)
                await deleteImage(profile.profilePictureId);

            // Update profile objt with null image fields
            profile.profilePicture = null;
            profile.profilePictureId = null;

        //COVER IMAGE
        } else if (imageType === 'cover') {

            // Check if previous image uploaded and delete it
            if (profile.coverPhotoId)
                await deleteImage(profile.coverPhotoId);


            // Update profile objt with null image fields
            profile.coverPhoto = null;
            profile.coverPhotoId = null;

        }
        
        // Update user profile
        const updatedProfile = await dbUpdateProfile(userId,profile);

        if(updatedProfile){

            return res
                .status(200)
                .json({ message: 'Image deleted successfully' });
        }
    
    } catch (err) {
        msgErr.errConsole(userId,'DELETE IMAGE', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errDeleteFile('image') });
    }
};