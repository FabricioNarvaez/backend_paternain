const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (user) => {
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return token;
}

module.exports = { generateToken };