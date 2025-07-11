const express = require('express');
const env = require('dotenv').config();
const connection = require('./database/connect');
/*
    Task manager application
*/

//Initialize the new application
const app = express();


//Setting the port app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(PORT);
});

//Home page
app.get('/',(req,res) => { 
    res.status(200).send({msg:"Hello this is the TaskManager application"});
});

