const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    bio : {
        type:String,
    },
    profilePicture : {
        type:String,
    },
    profilePictureId : {
        type:String,
    },
    coverPhoto : {
        type:String,
    },
    coverPhotoId : {
        type:String,
    },
    
},{timestamps:true})

const Profile = mongoose.model('profile',profileSchema);

module.exports = Profile;