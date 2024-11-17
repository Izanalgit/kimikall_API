const { dbFindUserId } = require('../services/userServices');

const dateFormat = (dateRaw) => {

    const date = new Date(dateRaw).toISOString();

    if(!date || date[10] !== "T")
        throw new Error('Invalid date format');

    const day = date.slice(0,10);
    const hour = date.slice(11,19);

    return {day , hour};
}

const msgFormat = async (userId, contactId, messagesRaw) => {

    const {name : contactName} = await dbFindUserId(contactId);

    const messagesClean = messagesRaw.map(message => {
        
        const date = dateFormat(message.createdAt);

        if (message.remit == userId)
            return {
                sender:'me',
                content: message.messageText,
                day:date.day,
                hour:date.hour
            }
        else 
            return {
                sender:contactName,
                content:message.messageText,
                day:date.day,
                hour:date.hour
            }
    })

    return messagesClean;
    
}

module.exports = {msgFormat};