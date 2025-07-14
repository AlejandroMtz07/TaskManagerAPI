const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function autheticateToken(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ msg: 'Login to see yout tasks' });
    }
    jwt.verify(
        token,
        secret,
        (err, decoded) => {
            if(err){
                return res.status(403).send({msg: 'Invalid token'});
            }
            req.user_id = decoded.user_id;
            next();
        }
    )
}

module.exports = autheticateToken;