const mongoose = require('mongoose');

const DB = process.env.MONGO_BBDD || 'kmkall-bbdd';
const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/';

// DB Connection
async function dbConnect(){
    try{
        await mongoose.connect(URI + DB);
        console.log('DB-CONNECTION DONE ON : ', DB);
    }catch(err){
        console.error('DB-CONNECTION ERROR : ',err);
        throw new Error('Need to connect to data base');
    }
}

module.exports = dbConnect;