const mongoose = require('mongoose');

const reKeySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    reEncrypted:{
        reEncryptedPrivateKeyPassword: { 
            type: String,
            required: true 
        },
        reIv: { 
            type: String,
            required: true 
        },
        reSalt: { 
            type: String,
            required: true 
        }
    },
    createdAt: { 
        type: Date, 
        expires: 3600, 
        default: Date.now 
    }
});

const ReKey = mongoose.model('reKey', reKeySchema);

module.exports = ReKey;