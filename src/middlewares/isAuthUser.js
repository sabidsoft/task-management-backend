const jwt = require("jsonwebtoken");

// Middleware function to check if the user is authenticated
const isAuthUser = async (req, res, next) => {
    try {
        // Extracting the token from the 'Authorization' header
        const token = req.headers?.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "You are not logged in"
            })
        }

        // Verify the token using the provided secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Set the decoded user information in the request object
        req.user = decoded;
        next(); // Move to the next middleware or route handler
    }
    catch (err) {
        // If an error occurs during token verification
        res.status(403).json({
            success: false,
            message: err.message
        });
    }
};

// Exporting the isAuthUser middleware function
module.exports = isAuthUser;