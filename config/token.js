const jwt = require('jsonwebtoken');

function generateVerificationToken(email, paymentid) {
    return jwt.sign({ email, paymentid }, process.env.JWT_SECRET);
}

module.exports = generateVerificationToken;