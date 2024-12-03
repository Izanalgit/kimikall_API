const mongoose = require('mongoose');

const forgottenSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    key: {
        type: String,
        required: true,
        unique: true,
      },
    expireAt: {
        type: Date,
        default: new Date(),
        expires: 3600, // (60*60) 1h expires time
    }
});

const ForgottenPasword = mongoose.model('forgottenPasword', forgottenSchema);

module.exports = ForgottenPasword;