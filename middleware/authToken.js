const jwt = require ('jsonwebtoken');
const {dbFindUserId} = require('./../services/userServices');
const {findToken} = require('./../services/tokenServices');

//Secret
const hashSc = process.env.JWT_SECRET;


//Request Token
async function verifyToken(req,res,next){

    const token = req.get('Authorization');

    if(!token)return res.status(401).json({messageErr:'Token missing'});

    jwt.verify(token,hashSc,async (err,decoded)=>{
        if(err){
            return res
                .status(401)
                .json({messageErr:'Invalid Token', error: err.message});
        }

        const sesToken = await findToken(decoded.user);

        if(!sesToken)return res.status(402).json({messageErr:'Not logued'});
        if(token != sesToken.token)return res.status(401).json({messageErr:'Invalid session'});

        req.user = decoded.user;

        next();
    })
}

//Verify user ID
async function verifyUser(req,res,next){
    const userId = req.user;
    const user = await dbFindUserId(userId);

    if(!user) 
        return res
            .status(401)
            .json({messageErr:'User not found'})

    req.user = user;
    next();
}


module.exports = { verifyToken, verifyUser};