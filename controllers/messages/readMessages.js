const {readMessages} = require('../../services/messagesServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgFormat} = require('../../utils/messageFormater');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const contactId = req.params.contact;

    try {
        //Incorrect parameters
        if(!contactId)
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});

        //Contact user get ID
        const userContact = await dbFindUserId(contactId);

        if(!userContact) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Contact')})

        //Read messages
        const messagesRaw = await readMessages(userId, contactId);
        const messages = await msgFormat(userId, contactId, messagesRaw);
    
        return res
            .status(200)
            .json({ messages });
    
    } catch (err) {
        msgErr.errConsole(userId,'READ MESSAGES', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('messages not found')});
    }
    
};