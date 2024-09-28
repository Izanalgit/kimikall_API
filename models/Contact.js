const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    contacts: [
        {
            contactId: { 
                type: mongoose.Schema.ObjectId, 
                required: true 
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ]
    
},{timestamps:true})

const Contact = mongoose.model('contact',contactSchema);

module.exports = Contact;