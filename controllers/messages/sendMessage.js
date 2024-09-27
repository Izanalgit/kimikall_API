const {sendMessage} = require('../../services/messagesServices');
const {dbFindUser} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

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

    //Receiver user get ID
    const userRecept = await dbFindUser(recep);

    if(!userRecept) 
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound('Receiver')})
     
    const recepId = userRecept._id;

    //Send Message
    try{
        const messageSended = await sendMessage(userId,recepId,message);
        
        if (messageSended)
            //Message sended 
            return res
                .status(200)
                .json({message:"Message properly sent"});
        else 
            //Null result on DB
            return res
                .status(500)
                .json({messageErr:msgErr.errApiInternal});
    }catch(err){
        return res
            .status(400)
            .json({messageErr:msgErr.errUserNotFound('Receiver')});
    }
    
};