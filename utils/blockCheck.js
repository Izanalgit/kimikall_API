const User = require('../models/User');

const blockCheck = async (user0Id,user1Id) => {

    const [blockRemit , blockRecep] = await Promise.all([
        User.findById(user0Id).select('blockedUsers'),
        User.findById(user1Id).select('blockedUsers'),
    ]);

    if(blockRemit.blockedUsers.includes(user1Id) || blockRecep.blockedUsers.includes(user0Id))
        return true;
    else
        return false;
}

module.exports = blockCheck;