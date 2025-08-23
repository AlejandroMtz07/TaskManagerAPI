const express = require('express');
const env = require('dotenv').config();
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
const cookieParser = require('cookie-parser');
const cors = require('cors');
/*
    Task manager application
*/

//Initialize the new application
const app = express();
app.use(cookieParser());

//Allowing the client to use the API
app.use(
    cors(
        {
            origin: 'http://localhost:5173',
            credentials: true
        },
    )
);

//Setting the port app
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});

//Home page
app.get('/', (req, res) => {
    res.send({ msg: 'Hello this is the TaskManager application' });
});

//Using the authentication routes
app.use('/api', authRoutes);
app.use('/api', tasksRoutes);