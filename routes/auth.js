/*
    Here we make the validation of the user credentials
*/
const express = require('express');
const db = require('../database/connect');
const { validationResult, param, body } = require('express-validator');
const router = express.Router();
const bodyParser = require('body-parser').json();
const bcrypt = require('bcrypt');



/*
    Register new user
*/
router.post(
    '/register',
    bodyParser,
    [
        //Validate the input fields
        body('name').notEmpty().withMessage('The name cant be empty'),
        body('lastname').notEmpty().withMessage('The name cant be empty'), ,
        body('username').notEmpty().withMessage('The username cant be empty'),
        body('username').isLength({ min: 5, max: 9 }).withMessage('The username lenght must be minimum 5 and maximum 9'),
        body('email').notEmpty().withMessage('The email can\'t be empty'),
        body('email').isEmail().withMessage('Email not valid'),
        body('password').notEmpty().withMessage('The password cant be empty'),
        body('password').isStrongPassword({ minLength: 1, minUppercase: 2, minSymbols: 1 }).withMessage('The password isnt so strong')
    ],
    (req, res) => {

        //Getting the result of the field validation
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() })
        }

        //Getting the values from the user
        const { name, lastname, username, email, password } = req.body;

        //Hash password
        const hashedPassword = bcrypt.hashSync(password,10);
        

        const sqlQuery = 'insert into users (name,lastname,username,email,password) values (?,?,?,?,?);';
        db.query(
            sqlQuery,
            [name, lastname, username, email, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(500).send({ error: 'Email already registered ' });
                    }
                    return res.status(500).send({ error: 'Error registering user' });
                }
                res.status(200).send({ msg: 'User registered' });
            }
        )
    }
);



/*
    Login registered user
*/
router.get(
    '/login',
    bodyParser,
    [
        body('email').notEmpty().withMessage('The email cant be empty'),
        body('email').isEmail().withMessage('Email not valid'),
        body('password').notEmpty().withMessage('The password cant be empty')
    ],
    (req, res) => {

        //Getting the validation result
        let validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(500).send(result.array());
        }

        //Checking if the user exists in the database
        const { email, password } = req.body;
        const sqlQuery = 'select * from users where email = ?';


        db.execute(
            sqlQuery,
            [email],
            (err, result) => {

                //Validate if the user exists
                if (result.length === 0) {
                    return res.status(404).send({ msg: 'User not found' });
                }

                //Compare the user password 
                const validateHash = bcrypt.compareSync(password,result[0]['password']);
                if(!validateHash){
                    return res.status(500).send({msg: 'Invalid credentials'});
                }
                res.status(200).send({ msg: 'Loggin succesful' });
            }
        );
    }
);


//Exports
module.exports = router;