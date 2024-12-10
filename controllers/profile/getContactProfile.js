const {dbFindProfile} = require('../../services/profileServices');
const {dbFindProfileExtended} = require('../../services/profileExtendedServices');
const {getContactList} = require('../../services/contactsServices');
const {countPremiumToken} = require('../../services/premyServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const contactId = req.params.contact;

    try{

        //Incorrect parameters
        if(!contactId)
            return res
                .status(400)
                .json({messageErr:msgErr.errParamsIncorrect});

        //Check premy
        const premiumTime = await countPremiumToken(userId);
        //Check contact
        const {contacts} = await getContactList(userId);

        if(!contacts.find((contact) => contact.contactId == contactId) && premiumTime < 1)
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Contact')})

        //Get profile contact
        const contactProfile = await dbFindProfile(contactId);
        const contactProfileExtended = await dbFindProfileExtended(contactId)

        if(!contactProfile) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Profile')})

        return res
            .status(200)
            .json({ contactProfile , contactProfileExtended});

    } catch (err) {
        msgErr.errConsole(userId,'GET CONTACT PROFILE', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }
};