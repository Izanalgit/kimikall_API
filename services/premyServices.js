const Premy = require('../models/Premy');

const {genPremyToken,verPremyToken} = require('../utils/jwtAuth');

//Create premy tokens document
const dbCreatePremyDocument = async (userId) => {
    try {
        const newPremyDoc = await Premy.create({ 
            userId, 
            tokens: []
        });
        return newPremyDoc;
    } catch (err) {
        console.error('ERROR : DB-CREATE PREMY DOCUMENT : ', err);
        throw new Error('can not create premy document');
    }
}

//Add message token
const addMessageToken = async (userId) => {
    try {
        const token = genPremyToken(userId,false);

        await Premy.findOneAndUpdate({userId},{
            $addToSet: {tokens : {token}}
        })

        return true;
    } catch (err) {
        console.error('ERROR : DB-ADD MESSAGE TOKEN : ', err);
        throw new Error('can not create message token');
    }
}

//Add premium token
const addPremiumToken = async (userId) => {

    const isPremy = await Premy.findOne({userId})
    if(isPremy.premium.token)
        throw new Error('is allready premium');

    try {
        const token = genPremyToken(userId,true);

        await Premy.findOneAndUpdate({userId},{premium:{token:token}})
        
        return true;
    } catch (err) {
        console.error('ERROR : DB-ADD PREMIUM TOKEN : ', err);
        throw new Error('can not create premium token');
    }
}

//Substact a message token
const removeMessageToken = async (userId) => {
    try {
        //Off token check
        const haveTokens = await Premy.findOne({userId});        
        if(haveTokens.tokens.length < 1) return false;

        //Token check
        const token = haveTokens.tokens[0].token;
        const {user,type} = verPremyToken(token);
        if(user !== userId || type !== 'message') return false;
    
        await Premy.findOneAndUpdate({userId},{
            $pull: {tokens : {token}}
        })

        return true;
    } catch (err) {
        console.error('ERROR : DB-SUBTRACT MESSAGE TOKEN : ', err);
        throw new Error('can not subtract message token');
    }
}

//Message tokens counter
const countMessageToken = async (userId) => {
    try {
        const premyDoc = await Premy.findOne({userId});

        return premyDoc.tokens.length;

    } catch (err) {
        console.error('ERROR : DB-COUNT MESSAGE TOKENS : ', err);
        throw new Error('can not count message tokens');
    }
}

//Premium counter
const countPremiumToken = async (userId) => {
    try {
        const premyDoc = await Premy.findOne({userId});

        if (!premyDoc || !premyDoc.premium || !premyDoc.premium.token)
            return 0

        const premiumExpiry = new Date(premyDoc.premium.createdAt);
        premiumExpiry.setDate(premiumExpiry.getDate() + 30);

        const timeLeft = Math.round((premiumExpiry - new Date()) / (1000 * 60 * 60 * 24));

        return timeLeft;


    } catch (err) {
        console.error('ERROR : DB-COUNT TIME PREMIUM TOKENS : ', err);
        throw new Error('can not count time premium token');
    }
}

//Delete premy tokens document
async function dbDeletePremyDocument(userId) {
    try{
        await Premy.findOneAndDelete({userId});
    }catch (err){
        console.error('ERROR : DB-DELETE PREMY DOCUMENT :',err);
        throw new Error ('can not delete premy document');
    }
}



module.exports = {
    dbCreatePremyDocument,
    addMessageToken,
    addPremiumToken,
    removeMessageToken,
    countMessageToken,
    countPremiumToken,
    dbDeletePremyDocument
}