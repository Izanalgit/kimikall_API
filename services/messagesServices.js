
const Message = require('../models/Message');
const User = require('../models/User');

// Send message with ID
async function sendMessage(remit,recep,messageText) {

    //Check if block
    const [blockRemit , blockRecep] = await Promise.all([
        User.findById(remit).select('blockedUsers'),
        User.findById(recep).select('blockedUsers'),
    ]);

    if(blockRemit.blockedUsers.includes(recep) || blockRecep.blockedUsers.includes(remit))
        throw new Error ('ERROR : can not send message to that user');

    //Send message
    const messageObjt = {remit,recep,messageText}

    try{
        const newMessage = await Message.create(messageObjt);
        return newMessage;

    }catch (err){
        console.error('DB-SEND MESSAGE ERROR : ',err);
        throw new Error ('ERROR : can not send new message');
    }
}

// Read messages from bouth IDs
async function readMessages(userID0,userID1) {

    try{

        if (!userID0 || !userID1) {
            throw new Error('ERROR : Invalid user IDs on read messages');
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
        console.error('DB-READ MESSAGES ERROR : ',err);
        throw new Error ('ERROR : can not read messages');
    }
}

module.exports = {sendMessage,readMessages}