const connections = require('./connections');
const {sendFriendRequest,sendNewMessageNoti,sendMessageReadNoti} = require('./events');

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
            
            if(userId) {
                authenticated = true;
                connections[userId] = ws;
                console.log(`USER : ${userId} : WSS CONECT`);
            }

        } else {
            //Messages logics
            const parsedMessage = JSON.parse(message);

            switch (parsedMessage.type) {
                case 'FRIEND_REQUEST':
                    sendFriendRequest(connections, userId, parsedMessage.to);
                    break;
                case 'NEW_MESSAGE':
                    sendNewMessageNoti(connections, userId, parsedMessage.to);
                    break;
                case 'IS_READ':
                    sendMessageReadNoti(connections, userId, parsedMessage.to);
                    break;
                default:
                    console.log('Unknown message type');
            }
        }
    });

    //WSS CLOSE
    ws.on('close', () => {
        delete connections[userId];
        console.log(`USER : ${userId} : WSS DISSCONECT`);
    });
}

module.exports = { handleSocketConnection };