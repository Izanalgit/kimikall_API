const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const {blockCheck} = require('../utils/blockCheck');

//Creates contacts documents of user
async function dbCreateContactDocument(userId) {
    try {
        const newContactsDoc = await Contact.create({ 
            userId, 
            contacts: [],
            contactsRequest: [],
            contactsSolicitation: []  
        });
        return newContactsDoc;
    } catch (err) {
        console.error('ERROR : DB-CREATE CONTACT DOCUMENT : ', err);
        throw new Error('can not create contact document');
    }
}

//Add user to solicitation list and ask contact
async function addSolicitationContact (userId, contactUserId){

    //Check if blocked
    const blocked = await blockCheck(userId,contactUserId);
    if(blocked)
        throw new Error ('can not find that user');

    //Check if allready are contacts
    const allreadyContacts = await Contact.findOne({
        userId,
        "contacts.contactId" : contactUserId
    })
    if(allreadyContacts)
        throw new Error ('that user is allready a contact');

    //Transaction db
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        await Contact.findOneAndUpdate({userId},{
            $addToSet: {contactsSolicitation : { contactId: contactUserId }}
        },{session})
        await Contact.findOneAndUpdate({contactUserId},{
            $addToSet: {contactsRequest : { contactId: userId }}
        },{session})

        await session.commitTransaction();

    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-ADD SOLICITATION CONTACT USER : ',err);
        throw new Error ('can not add that solicitation contact');
    } finally {
        session.endSession();
    }
}

//Add user to contact list (accepts request)
async function addContactUser (userId, contactUserId){

    //Check if blocked
    const blocked = await blockCheck(userId,contactUserId);
    if(blocked)
        throw new Error ('can not find that user');

    //Transaction db
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        await Contact.findOneAndUpdate({userId},{
            $addToSet: {contacts : { contactId: contactUserId }},
            $pull: {contactsRequest : { contactId: contactUserId }}
        },{session})
        await Contact.findOneAndUpdate({contactUserId},{
            $addToSet: {contacts : { contactId: userId }},
            $pull: {contactsSolicitation : { contactId: userId }},
        },{session})

        await session.commitTransaction();

    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-ADD CONTACT USER : ',err);
        throw new Error ('can not add that user contact');
    }finally {
        session.endSession();
    }
}

//Remove users from bouth contact lists
async function removeContactUser (userId, contactUserId) {

    //Transaction db
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        await Contact.findOneAndUpdate({userId},{
            $pull: {contacts : { contactId: contactUserId }}
        },{session})

        await Contact.findOneAndUpdate({contactUserId},{
            $pull: {contacts : { contactId : userId}}
        },{session})

        await session.commitTransaction();
    
    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-REMOVE CONTACT USERS : ',err);
        throw new Error ('can not remove that user contact');
    } finally{
        await session.endSession();
    }
}

//Get contacts user lists
async function getContactList(userId) {
    try{
        const userContacts = await Contact.findOne({userId});
        return {
            contacts : userContacts.contacts,
            solicitations : userContacts.contactsSolicitation,
            requests : userContacts.contactsRequest};

    }catch (err){
        console.error('ERROR : DB-GET CONTACT USER LIST : ',err);
        throw new Error ('can not get contact user list');
    }
}

//Delete contacts user list
async function deleteContactList(userId) {
    try{
        await Contact.findOneAndDelete({userId});
    }catch (err){
        console.error('ERROR : DB-DELETE CONTACT USER LIST :',err);
        throw new Error ('can not delete contact user list');
    }
}

module.exports = {
    dbCreateContactDocument,
    addContactUser,
    addSolicitationContact,
    removeContactUser,
    getContactList,
    deleteContactList
}