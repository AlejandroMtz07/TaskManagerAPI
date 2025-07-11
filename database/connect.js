const mysql = require('mysql2');
const env = require('dotenv').config();


//TODO Change the database name for the TaskManager app

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PWD,
    database: process.env.DATABASE_NAME
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    }else{
        console.log('Database connected');
    }
});

module.exports = connection;