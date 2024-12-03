const {decryptPrivateKey} = require('../utils/pairKeys');
const {validationMessageDecrypt} = require('../utils/messageCrypto');
const {getPrivate} = require('../services/pairKeyServices');
const {msgErr} = require('../utils/errorsMessages')

const password = process.env.MASTER_PAIR_KEY;

async function filterMessage(req,res,next) {

    const userId = req.user;
    const {messageRemit} = req.body.payload;

    try{

        const keyObj = await getPrivate(userId);
        const decKey = decryptPrivateKey(password,keyObj);

        const messageValidation = validationMessageDecrypt(messageRemit, decKey);

        if(!messageValidation)
            throw new Error("unable to validate message");
            
        req.body.messageValidation = messageValidation;

        next();

    }catch(err){
        msgErr.errConsole(userId,'VALIDATE MESSAGE', err);

        if(!messageRemit)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        return res
            .status(422)
            .json({ messageErr:msgErr.errGeneral('unable to validate message')});
    }
}


module.exports = {filterMessage}