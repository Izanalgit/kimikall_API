const {dbFindProfile,dbUpdateProfile} = require('../../services/profileServices');
const {uploadImage,deleteImage} = require('../../services/imagesServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    try {
        const userId = req.user;
        const file = req.file;
        const payload = req.body.payload;

        let imageUrl;
        let publicId;

        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {imageType} = payload;

        //Incorrect payload
        if(!imageType)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //No image
        if (!file)
            return res
                .status(400)
                .json({ messageErr: 'No file uploaded' });

        //Check and get user profile
        const profile = await dbFindProfile(userId);

        if(!profile)
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Profile')})

        //Image update

        //PROFILE IMAGE
        if (imageType === 'profile') {

            // Check if previous image uploaded and delete it
            if (profile.profilePictureId)
                await deleteImage(profile.profilePictureId);

            // Upload image
            const result = await uploadImage(file.path, 'profile_pictures');
            imageUrl = result.url;
            publicId = result.publicId;

            // Update profile objt with new image fields
            profile.profilePicture = imageUrl;
            profile.profilePictureId = publicId;

        //COVER IMAGE
        } else if (imageType === 'cover') {

            // Check if previous image uploaded and delete it
            if (profile.coverPhotoId)
                await deleteImage(profile.coverPhotoId);

            // Upload image
            const result = await uploadImage(file.path, 'cover_photos');
            imageUrl = result.url;
            publicId = result.publicId;

            // Update profile objt with new image fields
            profile.coverPhoto = imageUrl;
            profile.coverPhotoId = publicId;

        } else
            return res
                .status(400)
                .json({ messageErr: 'Invalid image type' });

        
        // Update user profile
        const updatedProfile = await dbUpdateProfile(userId,profile);

        if(updatedProfile)
            return res
                .status(200)
                .json({ message: 'Image updated successfully', updatedProfile });
    
    } catch (err) {

        console.error('ERROR : UPDATE IMAGE : ', err);
        return res
            .status(500)
            .json({ messageErr: 'Error updating image' });
    }
};