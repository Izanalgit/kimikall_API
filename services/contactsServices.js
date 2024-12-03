const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const User = require('../models/User');
const {blockCheck} = require('../utils/blockCheck');
const {sendPublicveKey} = require('./pairKeyServices');
const {dbFindProfile} = require('./profileServices');

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

//Check if allready are contacts
async function contactCheck (userId,contactUserId) {
    const alreadyContacts = await Contact.findOne({
        userId,
        "contacts.contactId" : contactUserId
    })
    return Boolean(alreadyContacts);
}
//Check if allready are contact request
async function contactRequestCheck (userId,contactUserId) {
    const alreadyRequest = await Contact.findOne({
        userId,
        "contactsSolicitation.contactId" : contactUserId
    })
    return Boolean(alreadyRequest);
}

//Add user to solicitation list and ask contact
async function addSolicitationContact (userId, contactUserId){

    //Check if blocked
    const blocked = await blockCheck(userId,contactUserId);
    if(blocked)
        throw new Error ('can not find that user');

    //Check if allready are contacts
    const alreadyContacts = await contactCheck(userId,contactUserId)
    if(alreadyContacts)
        throw new Error ('that user is allready a contact');

    //Check if allready are requests
    const alreadyRequest = await contactRequestCheck(userId,contactUserId)
    if(alreadyRequest) return;
        
    // Get contact names
    const [user, contactUser] = await Promise.all([
        User.findById(userId, "name"), 
        User.findById(contactUserId, "name")
    ]);
    if (!user || !contactUser) 
        throw new Error("user or contact user not found");

    // Get contact images
    const imageUser = await dbFindProfile(userId)
    const imageContact = await dbFindProfile(contactUserId);

    //Transaction db
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        await Contact.findOneAndUpdate({userId},{
            $addToSet: {
                contactsSolicitation : { 
                    contactId: contactUserId,
                    contactName: contactUser.name,
                    profilePicture : imageContact.profilePicture  
                }
            }
        },{session})
        await Contact.findOneAndUpdate({userId:contactUserId},{
            $addToSet: {
                contactsRequest : { 
                    contactId: userId,
                    contactName: user.name,
                    profilePicture : imageUser.profilePicture 
                }
            }
        },{session})

        await session.commitTransaction();

    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-ADD SOLICITATION CONTACT USER : ',err);
        throw new Error ('can not add that solicitation contact');
    } 
    finally {
        session.endSession();
    }
}

//Add user to contact list (accepts request)
async function addContactUser (userId, contactUserId){

    //Check if allready are contacts
    const alreadyContacts = await contactCheck(userId,contactUserId)
    if(alreadyContacts)
        throw new Error ('that user is allready a contact');

    //Check if blocked
    const blocked = await blockCheck(userId,contactUserId);
    if(blocked)
        throw new Error ('can not find that user');

    // Get contact names
    const [user, contactUser] = await Promise.all([
        User.findById(userId, "name"), 
        User.findById(contactUserId, "name")
    ]);
    if (!user || !contactUser) 
        throw new Error("user or contact user not found");

    // Get contact images
    const imageUser = await dbFindProfile(userId)
    const imageContact = await dbFindProfile(contactUserId);

    // Get contact public key
    const publicKeyUser = await sendPublicveKey(userId);
    const publicKeyContact = await sendPublicveKey(contactUserId);

    //Transaction db
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        await Contact.findOneAndUpdate({userId},{
            $addToSet: {
                contacts : { 
                    contactId: contactUserId , 
                    contactName: contactUser.name,
                    profilePicture : imageContact.profilePicture,
                    contactPublicKey: publicKeyContact
                }
            },
            $pull: {contactsRequest : { contactId: contactUserId }}
        },{session})
        await Contact.findOneAndUpdate({userId:contactUserId},{
            $addToSet: {
                contacts : { 
                    contactId: userId ,
                    contactName: user.name,
                    profilePicture : imageUser.profilePicture,
                    contactPublicKey: publicKeyUser
                }
            },
            $pull: {contactsSolicitation : { contactId: userId }},
        },{session})

        await session.commitTransaction();

    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-ADD CONTACT USER : ',err);
        throw new Error ('can not add that user contact');
    }
    finally {
        session.endSession();
    }
}

//Not add user to contact list (Decline request)
async function declineContactUser (userId, contactUserId){

    //Transaction db
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        await Contact.findOneAndUpdate({userId},{
            $pull: {contactsRequest : { contactId: contactUserId }}
        },{session})
        await Contact.findOneAndUpdate({userId:contactUserId},{
            $pull: {contactsSolicitation : { contactId: userId }},
        },{session})

        await session.commitTransaction();

    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-DECLINE CONTACT USER : ',err);
        throw new Error ('can not decline that user request');
    }
    finally {
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

        await Contact.findOneAndUpdate({userId: contactUserId},{
            $pull: {contacts : { contactId : userId}}
        },{session})

        await session.commitTransaction();
    
    }catch (err){
        await session.abortTransaction();

        console.error('ERROR : DB-REMOVE CONTACT USERS : ',err);
        throw new Error ('can not remove that user contact');
    } 
    finally{
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
            requests : userContacts.contactsRequest
        };

    }catch (err){
        console.error('ERROR : DB-GET CONTACT USER LIST : ',err);
        throw new Error ('can not get contact user list');
    }
}

//Update contacts name user
async function updateNameOnContacts(userId,newName) {
    try{

        await Contact.updateMany(
            { 
                contacts: { 
                    $elemMatch: { contactId: userId } 
                } 
            },
            {
                $set: { "contacts.$[elem].contactName": newName }
            },
            {
                arrayFilters: [ { "elem.contactId": userId } ]
            }
        );

    }catch (err){
        console.error('ERROR : DB-UPDATE NAME ON CONTACT USER LIST :',err);
        throw new Error ('can not update name on contact user list');
    }
}

//Update contacts public key user - DEPRECATED
async function updatePublicKeyOnContacts(userId,newPublicKey) {
    try{

        if(!newPublicKey)
            throw new Error ('needed new public key');

        await Contact.updateMany(
            { 
                contacts: { 
                    $elemMatch: { contactId: userId } 
                } 
            },
            {
                $set: { "contacts.$[elem].contactPublicKey": newPublicKey }
            },
            {
                arrayFilters: [ { "elem.contactId": userId } ]
            }
        );

    }catch (err){
        console.error('ERROR : DB-UPDATE PUBLIC KEY ON CONTACT USER LIST :',err);
        throw new Error ('can not update public key on contact user list');
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
    contactCheck,
    contactRequestCheck,
    addContactUser,
    addSolicitationContact,
    declineContactUser,
    removeContactUser,
    getContactList,
    updateNameOnContacts,
    updatePublicKeyOnContacts,
    deleteContactList
}