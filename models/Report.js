const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    reportedId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    problem: { 
        type: String, 
        require: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
    
})

const Report = mongoose.model('report',reportSchema);

module.exports = Report;