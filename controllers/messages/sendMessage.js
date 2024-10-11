const {sendMessage} = require('../../services/messagesServices');
const {dbFindUserId} = require('../../services/userServices');
const {countMessageToken,countPremiumToken,removeMessageToken} = require('../../services/premyServices');
const {sendNewMessageNoti} = require('../../websockets/events');
const connections = require('../../websockets/connections');
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

        //Premy tokens
        const premiumTime = await countPremiumToken(userId);
        const msgTokens =  await countMessageToken(userId);

        let substactToken;

        //Premium and tokens check
        if(premiumTime === 0 && msgTokens === 0)
            return res
                .status(402)
                .json({message:"No tokens or premium left",sended: false});

        //Message token substact if not premium
        if(premiumTime === 0 && msgTokens > 0)
            substactToken = await removeMessageToken(userId);
        
        //Token double check
        if(!substactToken)
            return res
                .status(402)
                .json({message:"No tokens left",sended: false});

        //Send Message
        await sendMessage(userId,recepId,message);
        
        //WebSocket notify
        sendNewMessageNoti(connections,userId,recepId);
        
        return res
            .status(200)
            .json({message:"Message properly sent", sended: true});

    }catch(err){
        msgErr.errConsole(userId,'SEND MESSAGE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
    
};