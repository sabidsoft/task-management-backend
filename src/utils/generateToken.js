const jwt = require("jsonwebtoken");

// Function to generate a JWT token
exports.generateToken = (payload, privateKey, expiresIn) =>
    jwt.sign(payload, privateKey, { expiresIn });