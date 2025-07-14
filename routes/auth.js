/*
    Here we make the validation of the user credentials
*/
const express = require('express');
const db = require('../database/connect');
const { validationResult, body } = require('express-validator');
const router = express.Router();
const bodyParser = require('body-parser').json();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');



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
    async (req, res) => {

        //Getting the result of the field validation
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() })
        }

        //Getting the values from the user
        const { name, lastname, username, email, password } = req.body;

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Registering the new user
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
router.post(
    '/login',
    bodyParser,
    [
        //Validate the login fields
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
            async (err, result) => {

                //Creating the JWT
                const token = jwt.sign(
                    {
                        user_id: result[0]['id'],
                        username: result[0]['username']
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES
                    }
                );
                res.cookie(
                    'token',
                    token,
                    {
                        httpOnly: true,
                        sameSite: true,
                        secure: false,                        
                    }
                );

                //Validate if the user exists
                if (result.length === 0) {
                    return res.status(404).send({ msg: 'User not found' });
                }

                //Compare the user password 
                const validateHash = await bcrypt.compare(password, result[0]['password']);
                if (!validateHash) {
                    return res.status(401).send({ msg: 'Wrong password' });
                }
                res.status(200).send({ msg: 'Loggin succesful' });
            }
        );
    }
);


/*
    Logout
*/
router.post(
    '/logout',
    (req,res)=>{
        res.clearCookie('token');
        res.send({msg: 'Success logout'});
    }
)

//Exports
module.exports = router;