const {dbFindProfile,dbUpdateProfile} = require('../../services/profileServices');
const {uploadImage,deleteImage} = require('../../services/imagesServices');
const {msgErr} = require('../../utils/errorsMessages');

const fs = require('fs/promises');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const file = req.file;
    const imageType = req.params.imageType;

    let imageUrl;
    let publicId;

    try {

        //Incorrect parameter
        if(imageType !== 'profile' && imageType !== 'cover')
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});

        //No image
        if (!file)
            return res
                .status(400)
                .json({ messageErr:msgErr.errGeneral('No file uploaded') });

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
            const result = await uploadImage(file.path, 'profile_pictures', 'profile');
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
            const result = await uploadImage(file.path, 'cover_photos', 'cover');
            imageUrl = result.url;
            publicId = result.publicId;

            // Update profile objt with new image fields
            profile.coverPhoto = imageUrl;
            profile.coverPhotoId = publicId;

        }
        
        // Update user profile
        const updatedProfile = await dbUpdateProfile(userId,profile);

        if(updatedProfile){

            //Delete image from temp upload directory
            await fs.unlink(file.path);

            return res
                .status(200)
                .json({ message: 'Image updated successfully', updatedProfile });
        }
    
    } catch (err) {
        msgErr.errConsole(userId,'UPDATE IMAGE', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errUpdateFile('image') });
    }
};