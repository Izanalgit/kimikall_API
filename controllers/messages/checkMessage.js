const {checkMessage} = require('../../services/messagesServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const messageId = req.params.message;

    try {
        //Incorrect parameters
        if(!messageId)
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});


        //Check message
        await checkMessage(messageId);
    
        return res.status(200);
    
    } catch (err) {
        msgErr.errConsole(userId,'CHECK MESSAGES', err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errGeneral('message not check as readed')});
    }
    
};