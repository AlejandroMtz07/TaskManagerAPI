const express = require('express');
const env = require('dotenv').config();
const connection = require('./database/connect');
const authRoutes = require('./routes/auth');
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
app.get('/users',(req,res) => { 
    res.send('This is the home page');
});

app.use('/api',authRoutes);
