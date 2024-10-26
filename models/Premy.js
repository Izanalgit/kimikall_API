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
            unique:true,
            sparse: true,
        },
        createdAt: { 
            type: Date,
            default: Date.now 
        }
    }],
    premium : [{
        premiumToken : { 
            type:String,
            unique:true,
            sparse: true,
        },
        createdAt: { 
            type: Date,
            expires: 2628288, //1 month 
            default: Date.now 
        },
    }]
})

const Premy = mongoose.model('premy',premySchema);

module.exports = Premy;