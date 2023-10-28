const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const  key = process.env.TOKEN_SECRET;
        const user = jwt.verify(token, key);
        User.findOne({_id: user.userId}).then(foundUser => {
            console.log(JSON.stringify(foundUser));
            req.user = user;
            next();
        }).catch(err => console.log(err));

    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false });
    }
};

module.exports = { authenticate };
 