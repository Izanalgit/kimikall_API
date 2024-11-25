//Friend request notify
function sendFriendRequest(connections, senderId, receiverId) {
    if (connections[receiverId]) {
        connections[receiverId].send(JSON.stringify({
            type: 'FRIEND_REQUEST',
            from: senderId
        }));
    }
}

//New message notify
function sendNewMessageNoti(connections, senderId, receiverId) {
    if (connections[receiverId]) {
        connections[receiverId].send(JSON.stringify({
            type: 'NEW_MESSAGE',
            from: senderId
        }));
    }
}

//Message read notify
function sendMessageReadNoti(connections, senderId, receiverId) {
    if (connections[receiverId]) {
        connections[receiverId].send(JSON.stringify({
            type: 'IS_READ',
            from: senderId
        }));
    }
}

module.exports = {
    sendFriendRequest,
    sendNewMessageNoti,
    sendMessageReadNoti
};