const jwt = require('jsonwebtoken');

function generateVerificationToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET);
}

module.exports = generateVerificationToken;