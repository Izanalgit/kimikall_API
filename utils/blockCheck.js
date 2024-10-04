const User = require('../models/User');

const blockCheck = async (remit,recep) => {

    const [blockRemit , blockRecep] = await Promise.all([
        User.findById(remit).select('blockedUsers'),
        User.findById(recep).select('blockedUsers'),
    ]);

    if(blockRemit.blockedUsers.includes(recep) || blockRecep.blockedUsers.includes(remit))
        throw new Error ('can not find to that user');
}

module.exports = blockCheck;