const express = require('express');
const morgan = require('morgan');

const dbConnect = require('./config/dataBaseConfig');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'http://localhost';

// DB Connection
dbConnect();

//JSON PARSER
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//LOGGER
app.use(morgan('dev'));

//HEALTH
app.get('/',(req,res)=>res.status(200).send('API IS RUNNING HEALTHY'));

//API ROUTES
app.use('/api',require('./routes'));

//API LISTEN
const server = app.listen(PORT, () => {
    console.log(`Server on ${HOST}:${PORT}`);
})

//TESTS EXPORTS
module.exports = {app,server};