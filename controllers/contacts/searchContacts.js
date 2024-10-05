const {searchProfiles} = require('../../services/searchServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    
    try {    

        const contactsList = await searchProfiles(userId,normalSearch,expandedSearch);
  
        return res
            .status(200)
            .json({contactsList});
    
    }catch (err) {
        msgErr.errConsole(userId,'SEARCH PROFILES CONTACTS', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};