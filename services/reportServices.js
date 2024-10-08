const Report = require('../models/Report');

//Create report
async function createReport(userId,reportedId,problem){
    try{
        const newReport = await Report.create({userId,reportedId,problem});
        return newReport;
    }catch (err){
        console.error('ERROR : DB-CREATE REPORT : ', err.errmsg);
        throw new Error ('can not create that report');
    }
}

//Find reports from user
async function findReportsUser(userId){
    try{
        const reports = await Report.find({userId});
        return reports;
    }catch (err){
        console.error('ERROR : DB-FIND REPORTS FROM USER : ',err.errmsg);
        throw new Error ('can not find that reports');
    }
}

//Find reports from reported
async function findReportsReported(reportedId){
    try{
        const reports = await Report.find({reportedId});
        return reports;
    }catch (err){
        console.error('ERROR : DB-FIND REPORTS FROM REPORTED : ',err.errmsg);
        throw new Error ('can not find that reports');
    }
}

//Check report
async function checkReport(reportDocId){
    try{
        await Report.findByIdAndUpdate(reportDocId, {check:true}, {new: true});
    }catch (err){
        console.error('ERROR : DB-CHECK REPORT : ',err);
        throw new Error ('can not check that report');
    }
}

//Delete report
async function deleteReport(reportDocId){
    try{
        await Report.findByIdAndDelete(reportDocId);
    }catch (err){
        console.error('ERROR : DB-DELETE REPORT : ', err.errmsg);
        throw new Error ('can not delete that report');
    }
}

module.exports = {
    createReport,
    findReportsUser,
    findReportsReported,
    checkReport,
    deleteReport
};