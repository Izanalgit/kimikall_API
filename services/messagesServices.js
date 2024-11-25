const Message = require('../models/Message');
const {blockCheck} = require('../utils/blockCheck');

// Send message with ID
async function sendMessage(remit,recep,messageText) {

    //Check if blocked
    const blocked = await blockCheck(remit,recep);
    if(blocked)
        throw new Error ('can not find to that user');

    //Send message
    const messageObjt = {remit,recep,messageText}

    try{
        const newMessage = await Message.create(messageObjt);
        return newMessage;

    }catch (err){
        console.error('ERROR : DB-SEND MESSAGE : ',err);
        throw new Error ('can not send new message');
    }
}

// Read messages from bouth IDs
async function readMessages(userID0,userID1) {

    try{

        if (!userID0 || !userID1) {
            throw new Error('Invalid user IDs on read messages');
        }

        const messages = await Message.find({
            $or:[
                {remit:userID0,recep:userID1},
                {remit:userID1,recep:userID0}
            ]
        }).sort({createdAt: 1})
        
        //Decrypt messages
        const decryptedMessages = messages.map(msg => ({ 
            ...msg.toObject(), //to plain object just in case
            messageText : msg.decryptMessage()
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

module.exports = {sendMessage,readMessages,checkMessage}