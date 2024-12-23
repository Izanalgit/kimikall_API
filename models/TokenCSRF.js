const mongoose = require('mongoose');

const tokenCSRFSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        unique: true 
    },
    tokenCSRF : {
        type:String,
        require: true,
        unique:true
    },
    csrf : {
        type:String,
        require: true,
        unique:true
    },
    createdAt: { 
        type: Date, 
        expires: 3600, 
        default: Date.now 
    }
})

const TokenCSRF = mongoose.model('tokenCSRF',tokenCSRFSchema);

module.exports = TokenCSRF;