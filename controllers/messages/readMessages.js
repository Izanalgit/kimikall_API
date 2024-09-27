const {readMessages} = require('../../services/messagesServices');
const {dbFindUser} = require('../../services/userServices');
const {msgFormat} = require('../../utils/messageFormater');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const contact = req.params.contact;

    //Incorrect parameters
    if(!contact)
        return res
            .status(400)
            .json({messageErr:msgErr.errParamsIncorrect});

    //Contact user get ID
    const userContact = await dbFindUser(contact);

    if(!userContact) 
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound('Contact')})
     
    const contactId = userContact._id;

    //Read messages
    try {
        const messagesRaw = await readMessages(userId, contactId);
        const messages = await msgFormat(userId, contactId, messagesRaw);
    
        return res
            .status(200)
            .json({ messages });
    
    } catch (err) {
        console.error('Error at read or format messages : ', err);
        return res.status(500).json({ messageErr:msgErr.errGeneral('messages not found')});
    }
    
};