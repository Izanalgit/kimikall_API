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
        return jwt.sign(payloadPremy,process.env.PREMY_JWT_SECRET,{expiresIn:'30d'});
    else
        return jwt.sign(payloadMessage,process.env.PREMY_JWT_SECRET);
}

//Premy Token verifier
function verPremyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.PREMY_JWT_SECRET);
        
        if (!decoded.user || !decoded.type) throw new Error('Invalid token');

        return decoded; 
    } catch (err) {
        throw new Error('Token verification failed: ', err.message);
    }
}

module.exports = {
    genToken,
    genPremyToken,
    verPremyToken
}