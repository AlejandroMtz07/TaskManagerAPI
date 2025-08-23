
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connect');

const registerUser = async (req, res) => {

    const { name, lastname, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    //Registering the new user
    const sqlQuery = 'insert into users (name,lastname,username,email,password) values (?,?,?,?,?);';
    db.query(
        sqlQuery,
        [name, lastname, username, email, hashedPassword],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    const match = err.sqlMessage.match(/for key '(.+)'/);
                    let field = null;
                    if (match && match[1]) {
                        // Obtiene la columna: users.email → email
                        field = match[1].split('.').pop();
                    }
                    return res.status(400).send({
                        msg: `El ${field.split('_')[0]} ya está registrado`
                    });
                }
                return res.status(500).send({ msg: 'Error registering user' });
            }
            res.status(200).send({ msg: 'User registered successfully' });
        }
    )
}

const loginUser = async (req, res) => {
    //Checking if the user exists in the database
    const { email, password } = req.body;
    const sqlQuery = 'select * from users where email = ?';

    //Sending to the database the information
    db.execute(
        sqlQuery,
        [email],
        async (err, result) => {

            //Validate if the query retursn something
            if (result.length === 0) {
                return res.status(404).send({ msg: 'User not found' + result });
            }
            //Check if something happened in the database
            if (err) {
                return res.send(505).send({ msg: 'Something happened' });
            }
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
            //Adding in the cookie the JWT
            res.cookie(
                'token', token,
                {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false,
                }
            );

            //Compare the user password 
            const validateHash = await bcrypt.compare(password, result[0]['password']);
            if (!validateHash) {
                return res.status(401).send({ msg: 'Wrong password' });
            }
            res.status(200).send({ msg: 'Login successful' });

        }
    );
}

const logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).send({ msg: 'Success logout' });
}

module.exports = { registerUser, loginUser, logoutUser };