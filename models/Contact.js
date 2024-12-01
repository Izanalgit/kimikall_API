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
            contactName:{
                type: String,
                required: true
            },
            profilePicture : {
                type:String
            },
            contactPublicKey:{
                type: String,
                required: true
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    contactsRequest: [
        {
            contactId: { 
                type: mongoose.Schema.ObjectId, 
                required: true 
            },
            contactName:{
                type: String,
                required: true
            },
            profilePicture : {
                type:String
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    contactsSolicitation: [
        {
            contactId: { 
                type: mongoose.Schema.ObjectId, 
                required: true 
            },
            contactName:{
                type: String,
                required: true
            },
            profilePicture : {
                type:String
            },
            createdAt: { 
                type: Date, 
                default: Date.now 
            }
        }
    ],
    
},{timestamps:true})

const Contact = mongoose.model('contact',contactSchema);

module.exports = Contact;