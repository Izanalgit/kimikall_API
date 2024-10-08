const sendgridConfig = {
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.EMAIL_SENDER
};

const verificationEmail = {
    subject:'Verifica tu cuenta',
    text:(key)=>`Aquí tienes tu enlace de verificación: ${process.env.HOST}/api/user/verify/${key}`,
    html:(key)=>`<p>Aquí tienes tu enlace de verificación: <a href="${process.env.HOST}/api/user/verify/${key}">Verificar cuenta</a></p>`
}

module.exports = {
    sendgridConfig,
    verificationEmail
};