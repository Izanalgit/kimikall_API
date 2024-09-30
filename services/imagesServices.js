const cloudinary = require('../config/cloudinary');

//Upload image to Cloudinary server
const uploadImage = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder, 
            use_filename: true,
            unique_filename: false,
        });

        return { url: result.secure_url, publicId: result.public_id };

    } catch (err) {
        console.error('ERROR : UPLOAD IMAGE : ', err);
        throw new Error('Error uploading image to Cloudinary');
    }
  };

//Delete image from Cloudinary server
const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error('ERROR : DELETE IMAGE : ', err);
        throw new Error('Error deleting image from Cloudinary');
    }
};
  
module.exports = { 
    uploadImage,
    deleteImage,
};