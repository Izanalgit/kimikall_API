const {wssTokenAuth} = require('../utils/jwtAuth');
const {msgErr} = require('../utils/errorsMessages');

function handleSocketConnection(ws, req) {
    let authenticated = false;
    let userId;

    //WSS HANDLER
    ws.on('message', async (message) => {

        //First message (auth) check
        if (!authenticated) {

            //Message format check
            let parsedMessage;

            try {
                parsedMessage = JSON.parse(message);
                if (!parsedMessage.token) throw new Error('WSS ERROR : No token sended');

            } catch (err) {
                msgErr.errConsole('UNKNOW USER','MALFORMED WSS MESSAGE',err.message);

                ws.send(JSON.stringify({ error: msgErr.errToken }));
                ws.close();

                return;
            }

            //Auth token check
            const token = parsedMessage.token;
            userId = await wssTokenAuth(ws,token);
            
            if(userId) authenticated = true;

        } else {
            //Messages logics
            console.log(`Mensaje recibido del usuario ${userId}: ${message}`);
        }
    });

    //WSS CLOSE
    ws.on('close', () => {
        console.log(`Usuario ${userId} desconectado`);
    });
}

module.exports = { handleSocketConnection };