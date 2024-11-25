const {checkMessage} = require('../../services/messagesServices');
const {sendMessageReadNoti} = require('../../websockets/events');
const connections = require('../../websockets/connections');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

    try {
        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {messageId,senderid} = payload;

        //Incorrect payload
        if(!messageId || !senderid)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //Check message
        await checkMessage(messageId);
        
        //WS Notify        
        sendMessageReadNoti(connections,userId,senderid);

        return res.status(200);

    
    } catch (err) {
        msgErr.errConsole(userId,'CHECK MESSAGES', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('message not check as readed')});
    }
    
};