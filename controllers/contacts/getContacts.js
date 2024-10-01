const {getContactList} = require('../../services/contactsServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;

    //Read contacts list
    try {
        const contactsList = await getContactList(userId);
  
        return res
            .status(200)
            .json({contactsList});
    
    } catch (err) {
        console.error('ERROR : GET CONTACTS : ',err);
        return res
            .status(500)
            .json({ messageErr:msgErr.errApiInternal});
    }
    
};