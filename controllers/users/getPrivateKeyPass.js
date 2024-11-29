const {sendPrivareKeyPass,sendPublicveKey} = require('../../services/pairKeyServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try{

        //Get profile user
        const keys = await sendPrivareKeyPass(userId);
        const public = await sendPublicveKey(userId);   

        const soloElPuebloSalvaAlPueblo={
            public,
            rps:keys.reEncryptedPrivateKeyPassword,
            riv:keys.reIv,
            rsa:keys.reSalt
        }

        return res
            .status(200)
            .json({ soloElPuebloSalvaAlPueblo });

    } catch (err) {
        msgErr.errConsole(userId,'GET PRIVATE KEY PASS', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
};