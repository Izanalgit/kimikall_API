const Message = require('../models/Message');
const mongoose = require('mongoose');
const {blockCheck,contactCheck} = require('../utils/blockCheck');

// Send message with ID
async function sendMessage(remit,recep,messageText,messageTextRemit) {

    //Check if blocked
    const blocked = await blockCheck(remit,recep);
    if(blocked)
        throw new Error ('can not find to that user');

    //Send message
    const messageObjt = {remit,recep,messageText,messageTextRemit}

    try{
        const newMessage = await Message.create(messageObjt);
        return newMessage;

    }catch (err){
        console.error('ERROR : DB-SEND MESSAGE : ',err);
        throw new Error ('can not send new message');
    }
}

// Read messages from bouth IDs
async function readMessages(userID0, userID1, limit = 10, beforeDate = null) {

    //Check if blocked
    const blocked = await blockCheck(userID0,userID1);
    if(blocked)
        throw new Error ('can not find to that user');

    //Check if contact
    const contact = await contactCheck(userID0,userID1);
    if(!contact)
        throw new Error ('that user is no longer contact');

    try{

        if (!userID0 || !userID1) {
            throw new Error('Invalid user IDs on read messages');
        }

        // Construct query
        const query = {
            $or: [
                { remit: userID0, recep: userID1 },
                { remit: userID1, recep: userID0 }
            ]
        };

        // Add `beforeDate` condition if provided
        if (beforeDate) {
            query.createdAt = { $lt: new Date(beforeDate) };
        }

        // Fetch messages
        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);
        
        //Decrypt messages
        const decryptedMessages = messages.map(msg => ({ 
            ...msg.toObject(), //to plain object just in case
            messageText : msg.decryptMessage(),
            messageTextRemit : msg.decryptMessageRemit()
        }));
        
        return decryptedMessages;

    }catch (err){
        console.error('ERROR : DB-READ MESSAGES : ',err);
        throw new Error ('can not read messages');
    }
}

// Check read a message by Id
async function checkMessage(messageId) {

    try{

        if (!messageId) {
            throw new Error('Invalid message ID');
        }

        const message = await Message.findOneAndUpdate(
            {_id:messageId},
            {read:true},
            {new: true}
        );

        return message;

    }catch (err){
        console.error('ERROR : DB-CHECK READ MESSAGE : ',err);
        throw new Error ('can not check read a message');
    }
}

// Check unread messages
async function countMessages(userId) {

    try{

        if (!userId) {
            throw new Error('Invalid user ID on check unread messages');
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const countMessages = await Message.aggregate([
            {$match: {recep:userObjectId,read:false}},
            {$group : {_id:"$remit",count : {$sum:1}}}
        ]);

        return countMessages.length ?
            countMessages.map(({_id,count})=>({sender:_id,count})) : [] ;

    }catch (err){
        console.error('ERROR : DB-COUNT UNREAD MESSAGES : ',err);
        throw new Error ('can not count messages');
    }
}

module.exports = {sendMessage,readMessages,checkMessage,countMessages}