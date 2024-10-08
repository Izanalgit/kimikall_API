const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
    },
    reportedId : {
        type:mongoose.Schema.ObjectId,
        require: true,
    },
    problem: { 
        type: String, 
        require: true 
    },
    check: {
        type: Boolean,
        require: true,
        default: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
    
})

const Report = mongoose.model('report',reportSchema);

module.exports = Report;