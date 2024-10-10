const mongoose = require('mongoose');

const premySchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    tokens : [{
        type:String,
        unique:true
    }],
    premium : {
        type:String,
        unique:true
    }
})

const Premy = mongoose.model('premy',premySchema);

module.exports = Premy;