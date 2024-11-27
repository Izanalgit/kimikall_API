const User = require('../models/User');
const Contact = require('../models/Contact');

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

const contactCheck = async (user0Id,user1Id) => {

    const contacts = await Contact.findOne({userId:user0Id});

    if(contacts.contacts.map((contactObj)=>(contactObj.contactId).toString()).includes(user1Id))
        return true;
    else
        return false;

}

module.exports = {blockCheck,contactCheck};