const {sendMessage} = require('../../services/messagesServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

    try{     
        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {recep,message} = payload;

        //Incorrect payload
        if(!recep && !message)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //Receiver user check
        const userRecept = await dbFindUserId(recep);

        if(!userRecept) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Receiver')})
        
        const recepId = userRecept._id;

        //Send Message
        await sendMessage(userId,recepId,message);
        
        return res
            .status(200)
            .json({message:"Message properly sent"});

    }catch(err){
        msgErr.errConsole(userId,'SEND MESSAGE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
    
};