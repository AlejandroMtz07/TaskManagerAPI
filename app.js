const express = require('express');
const env = require('dotenv').config();
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks')
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
app.get('/',(req,res)=>{
    res.send({msg: 'Hello this is the TaskManager application'})
});

//Using the authentication routes
app.use('/api',authRoutes);
app.use('/api',tasksRoutes);