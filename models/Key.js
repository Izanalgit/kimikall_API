const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    publicKey: { 
        type: String, 
        required: true 
    },  
    encryptedPrivateKey: { 
        type: String, 
        required: true 
    },  
    iv: { 
        type: String, 
        required: true 
    }, 
    salt: { 
        type: String, 
        required: true 
    }
});

const Key = mongoose.model('key', keySchema);

module.exports = Key;