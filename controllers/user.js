const signData = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


function generateAccessToken(id){
    return jwt.sign({userId: id}, process.env.TOKEN_SECRET)
}

// sign in logic 
exports.signin = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        await signData.create({
            name: name,
            email: email,
            password: hashedPassword, // Store the hashed password in the database
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
};

    // login logic
// Login logic
exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await signData.findOne({ where: { email: email } });

        if (!user) {
            // User not found, send a 404 response
            return res.status(404).json({ message: 'User not found' });
        }

        const storedPassword = user.password;

        const passwordMatch = await bcrypt.compare(password, storedPassword);

        if (passwordMatch) {
            // Password matches, send a success response and redirect
            res.status(200).json({ message: 'User login successful', token: generateAccessToken(user.id)});
          
        } else {
            // Password doesn't match, send a 401 response (Unauthorized)
            return res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

