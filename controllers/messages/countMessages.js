const {countMessages} = require('../../services/messagesServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;

    try {

        //Count unread message
        const countedMessages = await countMessages(userId)

        return res.status(200).json({count : countedMessages});

    
    } catch (err) {
        msgErr.errConsole(userId,'COUNT UNREAD MESSAGES', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('messages unread not counted')});
    }
    
};