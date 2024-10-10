const mongoose = require('mongoose');

const premySchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    tokens : [{
        token : {
            type:String,
            require: true
        },
        createdAt: { 
            type: Date,
            default: Date.now 
        }
    }],
    premium : {
        token : {
            type:String,
            require: true,
            unique:true
        },
        createdAt: { 
            type: Date,
            expires: 2628288, //1 month 
            default: Date.now 
        },
    }
})

const Premy = mongoose.model('premy',premySchema);

module.exports = Premy;