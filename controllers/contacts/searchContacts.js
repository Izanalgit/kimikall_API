const {searchProfiles} = require('../../services/searchServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;
    
    try {

        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {normalSearch,expandedSearch} = payload;

        //Incorrect payload
        if(!normalSearch)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});    

        const profiles = await searchProfiles(userId,normalSearch,expandedSearch);
  
        return res
            .status(200)
            .json({profiles});
    
    }catch (err) {
        msgErr.errConsole(userId,'SEARCH PROFILES CONTACTS', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};