const jwt = require ('jsonwebtoken');
const crypto = require('crypto');
const {findToken} = require('./../services/tokenServices');
const {msgErr} = require ('./errorsMessages');


//Session Token generator
function genToken(user){
    const payload = {user: user._id};
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'2h'});
}

//CSRF Token generator
function genCSRFToken(){
    const randomUUID = crypto.randomUUID();
    const csrfHash = crypto.createHash('sha256').update(randomUUID).digest('hex');
    const payload = { csrf: csrfHash };
    return {
        csrf: csrfHash,
        token: jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'2h'})
    };
}

//Premy Token generator
function genPremyToken(userId,premy){

    const timeStamp = new Date().toISOString();

    const payloadMessage = {user: userId, type: 'message', createAt: timeStamp};
    const payloadPremy = {user: userId, type: 'premy', createAt: timeStamp};
    
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

//WebSocket auth
async function wssTokenAuth(ws,token){
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user;

        //User login check
        const sesToken = await findToken(userId);
        if(!sesToken) throw new Error(msgErr.errSession(false));
        if(sesToken.token != token) throw new Error(msgErr.errToken);
        
        console.log(`USER : ${userId} : WEBSOCKET CONNECT`);
        return userId;        

    } catch (err){
        msgErr.errConsole('UNKNOW USER','WSS AUTH',err);
        ws.close();
        return null;
    }
}


module.exports = {
    genToken,
    genCSRFToken,
    genPremyToken,
    verPremyToken,
    wssTokenAuth
}