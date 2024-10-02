const {getContactList} = require('../../services/contactsServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try {    

        //Read contacts list
        const contactsList = await getContactList(userId);
  
        return res
            .status(200)
            .json({contactsList});
    
    }catch (err) {
        msgErr.errConsole(userId,'GET CONTACTS', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};