/*
    Here we make the validation of the user credentials
*/
const express = require('express');
const db = require('../database/connect');
const { validationResult, param, body } = require('express-validator');
const router = express.Router();
const bodyParser = require('body-parser').json();



//Register
router.post(
    '/register',
    bodyParser,
    [
        //Validate the input fields
        body('name').notEmpty().withMessage('The name cant be empty'),
        body('lastname').notEmpty().withMessage('The name cant be empty'),,
        body('username').notEmpty().withMessage('The username cant be empty'),
        body('password').notEmpty().withMessage('The password cant be empty'),
        body('password').isStrongPassword({ minLength: 1, minUppercase: 2, minSymbols: 1 }).withMessage('The password isnt so strong')
    ],
    (req, res) => {

        //Getting the result of the validation of the fields
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() })
        }

        //Getting the values from the user
        const { name, lastname, username , password } = req.body;
        const sqlQuery = 'insert into users (name,lastname,username,password) values (?,?,?,?);';
        db.query(sqlQuery, [name, lastname, username, password], (err, result) => {
            if (err) {
                return res.status(500).send('Error registering user' + err);
            }
            res.status(200).send({ msg: 'User registered' });
        })


    });



//Loggin
router.get(
    '/login',
    bodyParser,
    [
        body('username').notEmpty().withMessage('The user cant be empty'),
        body('password').notEmpty().withMessage('The password cant be empty')
    ],
    (req, res) => {
        
        //Getting the validation result
        let result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(500).send(result.array());
        }

        //Checking if the user exists in the database
        const {username, password} = req.body;
        const sqlQuery = 'select * from users where username = ? and password = ?';
        db.query(sqlQuery,[username,password],(err,result)=>{
            if(err){
                return res.status(404).send({msg: 'This use dont exists'});
            }
            res.status(200).send({msg: 'Loggin succesful'});
        });
    }
);


//Exports
module.exports = router;