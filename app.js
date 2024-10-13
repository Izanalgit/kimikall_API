const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const morgan = require('morgan');

const dbConnect = require('./config/dataBaseConfig');
const {handleSocketConnection} = require('./websockets/handlers');

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

//HTTP SHARED SERVER
let server = http.createServer(app);

//WEBSOCKET INIT
const wss = new WebSocket.Server({server});
wss.on('connection', handleSocketConnection);

//API LISTEN
server = app.listen(PORT, () => {
    console.log(`Server on ${HOST}:${PORT}`);
})

//TESTS EXPORTS
module.exports = {app,server};