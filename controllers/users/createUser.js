const {dbCreateUser} = require('../../services/userServices');
const {passHasher} = require('../../utils/passwordHasher');
const {msgErr} = require('../../utils/errorsMessages');

module.exports =async (req,res)=>{
    let newUser;
    const payload = req.body.payload;

    //Logued check
    const sessionToken = req.user; 
    if(sessionToken)
        return res
            .status(409)
            .json({messageErr:msgErr.errSession(true)})

    //No payload check
    if(!payload)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadRequired});

    const {name,email,pswd} = payload;

    //Incorrect payload check
    if(!name || !email || !pswd)
        return res
            .status(400)
            .json({messageErr:msgErr.errPayloadIncorrect});
    
    //Create new user
    try{
        const hashedPaswd = await passHasher(pswd); //hash user password
        newUser = await dbCreateUser({name,email,pswd:hashedPaswd})
    }catch(err){
        return res
            .status(401)
            .json({messageErr:err})        
    }

    //Check created user
    if(!newUser) 
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});

    //Response
    res
        .status(201)
        .json({name:newUser.name,email:newUser.email});

}