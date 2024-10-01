const Contact = require('../models/Contact');

//Creates contacts documents of user
async function dbCreateContactDocument(userId) {
    try {
        const newContactsDoc = await Contact.create({ userId, contacts: [] });
        return newContactsDoc;
    } catch (err) {
        console.error('DB-CREATE CONTACT DOCUMENT ERROR : ', err);
        throw new Error('ERROR : can not create contact document');
    }
}

//Add user to contact list
async function addContactUser (userId, contactUserId){
    try{
        await Contact.findOneAndUpdate({userId},{
            $addToSet: {contacts : contactUserId}
        })
    }catch (err){
        console.error('DB-ADD CONTACT USER ERROR : ',err);
        throw new Error ('ERROR : can not add that user contact');
    }
}

//Remove an user from contact list
async function removeContactUser (userId, contactUserId) {
    try{
        await Contact.findOneAndUpdate({userId},{
            $pull: {contacts : contactUserId}
        })
    }catch (err){
        console.error('DB-REMOVE CONTACT USERS ERROR : ',err);
        throw new Error ('ERROR : can not remove that user contact');
    }
}

//Get contacts user list
async function getContactList(userId) {
    try{
        const userContacts = await Contact.findOne({userId});
        return userContacts.contacts;
    }catch (err){
        console.error('DB-GET CONTACT USER LIST ERROR : ',err);
        throw new Error ('ERROR : can not get contact user list');
    }
}

module.exports = {
    dbCreateContactDocument,
    addContactUser,
    removeContactUser,
    getContactList
}