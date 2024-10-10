const jwt = require ('jsonwebtoken');

//Session Token generator
function genToken(user){
    const payload = {user: user._id};
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'2h'});
}

//Premy Token generator
function genPremyToken(userId,premy){

    const payloadMessage = {user: userId, type: 'message'};
    const payloadPremy = {user: userId, type: 'premy'};
    
    if(premy)
        return jwt.sign(payloadPremy,process.env.JWT_PREMY_SECRET,{expiresIn:'30d'});
    else
        return jwt.sign(payloadMessage,process.env.JWT_PREMY_SECRET);
}

//Premy Token verifier
function verPremyToken(token) {
    jwt.verify(token,JWT_PREMY_SECRET, (err,decoded)=>{
        
        if(err) throw new Error(err);

        const user = decoded.user;
        const type = decoded.type;

        return {user,type};
    })
}
module.exports = {
    genToken,
    genPremyToken,
    verPremyToken
}