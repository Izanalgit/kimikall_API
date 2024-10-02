const {dbUpdateUser} = require('../../services/userServices');
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

        const {name,email,pswd} = payload;

        //Incorrect payload
        if(!name && !email && !pswd)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        const user = {...payload};

        //DB query
        const updtUser = await dbUpdateUser(userId,user);
        
        return res
            .status(200)
            .json({name:updtUser.name,email:updtUser.email});

    }catch(err){
        msgErr.errConsole(userId,'UPDATE ACOUNT', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errDbInvalidInput});
    }
};