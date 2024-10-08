const {createReport} = require('../../services/reportServices');
const {dbFindUserId} = require('../../services/userServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    
    const userId = req.user;
    const payload = req.body.payload;

    try{

        //No payload
        if(!payload)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadRequired});

        const {reportUser,problem} = payload;

        //Incorrect payload
        if(!reportUser || !problem)
            return res
                .status(400)
                .json({messageErr:msgErr.errPayloadIncorrect});

        //User to report check ID
        const reportedUserObj = await dbFindUserId(reportUser);

        if(!reportedUserObj) 
            return res
                .status(401)
                .json({messageErr:msgErr.errUserNotFound('Report')})
        
        const reportId = reportedUserObj._id;

        //Report user  
        await createReport(userId,reportId,problem);

        return res
            .status(200)
            .json({message:'User reported successfully'});


    }catch (err) {
        msgErr.errConsole(userId,'REPORT USER', err);
        return res
            .status(500)
            .json({messageErr:msgErr.errApiInternal});
    }    
};