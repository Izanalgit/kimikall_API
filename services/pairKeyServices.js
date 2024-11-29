const Key = require('../models/Key');
const ReKey = require('../models/ReKey');

const {generateKeyPair,encryptPrivateKey,decryptPrivateKey} = require('../utils/pairKeys');

// Create Key documents
async function dbCreateKeyDocument(userId,password) {
    try {

        const { publicKey, privateKey } = generateKeyPair();
        const { encryptedPrivateKey, iv, salt } = encryptPrivateKey(privateKey, password);

        const newKeys = await Key.create({
            userId,
            publicKey,
            encryptedPrivateKey,
            iv,
            salt
        });

        return newKeys;

    } catch (err) {
        console.error('ERROR : DB-CREATE KEYS DOCUMENT : ', err);
        throw new Error('can not create keys document');
    }
}

// Update Key document
async function dbUpdateKeyDocument(userId,password) {
    try {

        const { publicKey, privateKey } = generateKeyPair();
        const { encryptedPrivateKey, iv, salt } = encryptPrivateKey(privateKey, password);

        const updatedKeys = await Key.findOneAndUpdate(
            {userId},
            {
                publicKey,
                encryptedPrivateKey,
                iv,
                salt
            },{new: true});

        return updatedKeys;

    } catch (err) {
        console.error('ERROR : DB-UPDATE KEYS DOCUMENT : ', err);
        throw new Error('can not update keys document');
    }
}

// Generate and send private key with temporal password
async function setPrivateKey(userId,password) {
    try {

        const keyData = await Key.findOne({userId});

        const decyptkey = decryptPrivateKey(password,keyData)
        const updatedReKeys = encryptPrivateKey(decyptkey);

        const reEncrypted = {
            reEncryptedPrivateKeyPassword:updatedReKeys.reEncryptedPrivateKeyPassword,
            reIv:updatedReKeys.reIv,
            reSalt:updatedReKeys.reSalt
        }

        await ReKey.create({userId,reEncrypted});

        return {
            ...updatedReKeys,
            publicKey : keyData.publicKey
        }

    } catch (err) {
        console.error('ERROR : DB-GENERATE RE KEYS : ', err);
        throw new Error('can not generate re keys');
    }
}

// Send public key
async function sendPublicveKey(userId) {
    try {

        const keyData = await Key.findOne({userId});

        return keyData.publicKey;

    } catch (err) {
        console.error('ERROR : DB-SEND PUBLIC KEY : ', err);
        throw new Error('can not send public key');
    }
}

// Send public password
async function sendPrivareKeyPass(userId) {
    try {

        const keyPass = await ReKey.findOne({userId});

        return keyPass.reEncrypted;

    } catch (err) {
        console.error('ERROR : DB-SEND PRIVATE KEY PASS: ', err);
        throw new Error('can not send private key pass');
    }
}

// Clean re-Keys document
async function dbCleanReKey(userId) {
    try {

        await ReKey.findOneAndDelete({userId});

    } catch (err) {
        console.error('ERROR : DB-CLEAN RE KEYS : ', err);
        throw new Error('can not clean re keys');
    }
}

// Delete Keys documents
async function dbDeleteKeyDocument(userId) {
    try {

        await Key.findOneAndDelete({userId})

    } catch (err) {
        console.error('ERROR : DB-DELETE KEYS DOCUMENT : ', err);
        throw new Error('can not delete keys document');
    }
}

module.exports = {
    dbCreateKeyDocument,
    dbUpdateKeyDocument,
    setPrivateKey,
    sendPublicveKey,
    sendPrivareKeyPass,
    dbCleanReKey,
    dbDeleteKeyDocument
}