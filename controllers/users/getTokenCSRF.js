const {findCSRFToken} = require('../../services/tokenCSRFServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try{

        //Get CSRF Token
        const {tokenCSRF} = await findCSRFToken(userId); 

        return res
            .status(200)
            .json({ tokenCSRF });

    } catch (err) {
        msgErr.errConsole(userId,'GET CSRF TOKEN', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errToken});
    }
};