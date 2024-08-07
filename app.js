const express = require('express');
const morgan = require('morgan');

const dbConnect = require('./config/dataBaseConfig');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

//DB Connection
dbConnect();

//LOGER
app.use(morgan('dev'));

//HEALTH
app.get('/',(req,res)=>res.status(200).send('API IS RUNNING HEALTHY'));

//API ROUTES
app.use('/api',require('./routes'));

app.listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
})