const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    token : {
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

const Token = mongoose.model('token',tokenSchema);

module.exports = Token;