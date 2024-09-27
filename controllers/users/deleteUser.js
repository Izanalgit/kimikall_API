const {dbFindUserLogIn , dbDeleteUser} = require('../../services/userServices');
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
    
    //Delete user
    const userDel = await dbDeleteUser(userId);
    if(!userDel)
        return res
            .status(401)
            .json({messageErr:msgErr.errGeneral('user not deleted')});


    //Log
    console.log(userDel.name,' deleted'); //IMPROVE!
    
    //Destroy session
    try{
        await cleanToken(userId)
    }catch(err){
        return res
            .status(401)
            .json({messageErr:err});
    }

    res.status(200)
        .json({message:`Farewell ${user.name}!`});
}