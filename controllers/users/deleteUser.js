const {dbFindUserLogIn , dbDeleteUser} = require('../../services/userServices');
const {dbDeleteProfile} = require('../../services/profileServices.js');
const {deleteContactList} = require('../../services/contactsServices.js');
const {cleanToken} = require('../../services/tokenServices');
const {msgErr} = require('../../utils/errorsMessages');

module.exports = async (req,res) => {
    const {email,pswd} = req.body.payload;
    const userId = req.user;

    //Check user
    const user = await dbFindUserLogIn(email,pswd);
    if(!user) return res
        .status(401)
        .json({messageErr:msgErr.errCredentialsIncorrect})


    //Check if is same user
    if(userId != user._id) {
        console.log(`ID ${userId} attepts to erase ${user._id}`);
        return res
            .status(401)
            .json({messageErr:msgErr.errUserNotFound()})
    }

    try{
        //Delete user
        const userDel = await dbDeleteUser(userId);

        await cleanToken(userId);
        await dbDeleteProfile(userId);
        await deleteContactList(userId);

        //Log
        console.log(userDel.name,' deleted'); //IMPROVE!

        return res
            .status(200)
            .json({message:`Farewell ${userDel.name}!`});

    }catch(err){
        console.error('ERROR : DELETE USER : ',err);
        return res
            .status(500)
            .json({messageErr:msgErr.errGeneral('user not deleted')});
    }
}