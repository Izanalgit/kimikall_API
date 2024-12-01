const { dbFindUserId } = require('../services/userServices');

// const dateFormat = (dateRaw) => {

//     const date = new Date(dateRaw).toISOString();

//     if(!date || date[10] !== "T")
//         throw new Error('Invalid date format');

//     const day = date.slice(0,10);
//     const hour = date.slice(11,19);

//     return {day , hour};
// }

const msgFormat = async (userId, contactId, messagesRaw) => {

    const {name : contactName} = await dbFindUserId(contactId);

    const messagesClean = messagesRaw.map(message => {
        
        // const date = dateFormat(message.createdAt);

        if (message.remit == userId)
            return {
                sender:'me',
                content: message.messageTextRemit,
                date: message.createdAt,
                messageId:message._id,
                isRead:message.read
            }
        else 
            return {
                sender:contactName,
                content:message.messageText,
                date: message.createdAt,
                messageId:message._id,
                isRead:message.read
            }
    })

    return messagesClean;
    
}

module.exports = {msgFormat};