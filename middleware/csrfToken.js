const jwt = require ('jsonwebtoken');
const {findCSRFToken} = require('./../services/tokenCSRFServices');

//Secret
const hashSc = process.env.JWT_SECRET;


//Request Token
async function verifyCSRFToken(req,res,next){

    const userId = req.user;
    const {tokenCSRF: token} = req.body.payload;

    if(!token)return res.status(401).json({messageErr:'Token CSRF missing'});

    jwt.verify(token,hashSc,async (err,decoded)=>{
        if(err){
            return res
                .status(401)
                .json({messageErr:'Invalid Token', error: err.message});
        }

        const {csrf} = await findCSRFToken(userId);

        if(!csrf)return res.status(402).json({messageErr:'Not csfr token saved'});
        if(decoded.csrf != csrf)return res.status(401).json({messageErr:'Invalid CSRF'});

        next();
    })
}


module.exports = { verifyCSRFToken};