const cloudinary = require('../config/cloudinary');

const uploadImage = async (filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder, 
            use_filename: true,
            unique_filename: false,
        });

        return result.secure_url;

    } catch (err) {
        console.error('ERROR : UPLOAD IMAGE : ', err);
        throw new Error('Error uploading image to Cloudinary');
    }
  };
  
  module.exports = { uploadImage };