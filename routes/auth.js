/*
    Here we make the validation of the user credentials
*/
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bodyParser = require('body-parser').json();
const { handleInputErrors } = require('../middleware/validation');
const { registerUser, loginUser, logoutUser } = require('../handlers/userHandler');



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
    handleInputErrors,
    registerUser
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
    handleInputErrors,
    loginUser
);


/*
    Logout
*/
router.post(
    '/logout',
    logoutUser,
)

//Exports
module.exports = router;