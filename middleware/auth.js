const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);
        const  key = process.env.TOKEN_SECRET;
        const user = jwt.verify(token, key);
        console.log(user);
        console.log('userid>>>>>>', user.userId); // Use lowercase userId

        User.findByPk(user.userId).then(foundUser => {
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
