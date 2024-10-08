const sgMail = require('@sendgrid/mail');
const {sendgridConfig,verificationEmail} = require('../config/sendgridConfig');

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

module.exports = {sendVerificationEmail}