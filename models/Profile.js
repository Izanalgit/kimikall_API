const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    age: {
        type: Number
    },
    genre: {
        type: String,
        enum : {
            values : [
                'Hombre',
                'Mujer',
                'Otro',
            ],
            message : '{VALUE} is not available'
        }
    },
    orentation: {
        type: String,
        enum : {
            values : [
                'Hetero',
                'Homo',
                'Otro',
            ],
            message : '{VALUE} is not available'
        }
    },
    special : [{
        type: String,
        enum : {
            values : [
                'A',
                'B',
                'C',
                'D',
                'F'
            ],
            message : '{VALUE} is not available'
        }
    }],
    location:{
        type: String,
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