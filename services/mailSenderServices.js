const sgMail = require('@sendgrid/mail');
const {sendgridConfig,verificationEmail,forgottenPassEmail} = require('../config/sendgridConfig');

sgMail.setApiKey(sendgridConfig.apiKey);

const sendVerificationEmail = async (email, key) => {

    if (!sendgridConfig.apiKey || !sendgridConfig.sender) {
        console.error('ERROR : DB-SEND VERIFICATION EMAIL : missing key or sender');
        throw new Error('verification email not sended');
    }
    
    const verifyMsg = {
        to: email,
        from: sendgridConfig.sender,
        subject: verificationEmail.subject,
        text: verificationEmail.text(key),
        html: verificationEmail.html(key),
    };

    try {
        await sgMail.send(verifyMsg);
        return true;
    } catch (err) {
        console.error('ERROR : DB-SEND VERIFICATION EMAIL : ',err.response?.body?.errors || err.message);
        throw new Error ('verification email not sended');
    }
}

const sendRecoverEmail = async (email, key) => {

    if (!sendgridConfig.apiKey || !sendgridConfig.sender) {
        console.error('ERROR : DB-SEND RECOVER EMAIL : missing key or sender');
        throw new Error('recover email not sended');
    }
    
    const recoverMsg = {
        to: email,
        from: sendgridConfig.sender,
        subject: forgottenPassEmail.subject,
        text: forgottenPassEmail.text(key),
        html: forgottenPassEmail.html(key),
    };

    try {
        await sgMail.send(recoverMsg);
        return true;
    } catch (err) {
        console.error('ERROR : DB-SEND RECOVER EMAIL : ',err.response?.body?.errors || err.message);
        throw new Error ('recover email not sended');
    }
}

module.exports = {sendVerificationEmail,sendRecoverEmail}