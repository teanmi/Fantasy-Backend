const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Fetch user from the database
    const user = await User.findUserByUsername(username);

    // Validate credentials
    if (user && user.password == password) {
        return res.status(200).json({ id: user.id, username: user.username });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
};
