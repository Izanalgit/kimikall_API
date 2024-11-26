//Friend request notify
function sendFriendRequest(connections, senderId, receiverId) {
    if (connections[receiverId]) {
        connections[receiverId].send(JSON.stringify({
            type: 'FRIEND_REQUEST',
            from: senderId
        }));
    }
}

//Friend request accept
function sendFriendAccept(connections, senderId, receiverId) {
    if (connections[receiverId]) {
        connections[receiverId].send(JSON.stringify({
            type: 'FRIEND_ACCEPT',
            from: senderId
        }));
    }
}

//Friend removed
function sendFriendRemoved(connections, senderId, receiverId) {
    if (connections[receiverId]) {
        connections[receiverId].send(JSON.stringify({
            type: 'FRIEND_REMOVED',
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
    sendFriendAccept,
    sendFriendRemoved,
    sendNewMessageNoti,
    sendMessageReadNoti
};