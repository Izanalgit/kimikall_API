const cloudinary = require('../config/cloudinaryConfig');

//Image tranformation configs

const imgsTransformations = {
    profile:[
        { width: 400, height: 400, crop: "limit" }, 
        { quality: "auto" }, 
        { fetch_format: "auto" }
    ],
    cover:[
        { width: 1200, height: 600, crop: "limit" }, 
        { quality: "auto" }, 
        { fetch_format: "auto" }
    ]
}


//Upload image to Cloudinary server
const uploadImage = async (filePath, folder, imageType) => {

    let imageTransformation; 
    if(imageType === 'profile') imageTransformation = imgsTransformations.profile;
    if(imageType === 'cover') imageTransformation = imgsTransformations.cover;

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder, 
            use_filename: true,
            unique_filename: false,
            transformation : imageTransformation
        });

        return { url: result.secure_url, publicId: result.public_id };

    } catch (err) {
        console.error('ERROR : UPLOAD IMAGE : ', err);
        throw new Error('uploading image to Cloudinary');
    }
  };

//Delete image from Cloudinary server
const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error('ERROR : DELETE IMAGE : ', err);
        throw new Error('deleting image from Cloudinary');
    }
};
  
module.exports = { 
    uploadImage,
    deleteImage,
};