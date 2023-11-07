const User = require("../models/User");

// Service function to create a new user
exports.signupService = async (data) => {
    const user = await User.create(data);
    return user;
}

// Function to retrieve a user by their email
exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    return user;
}

// Function to retrieve a user by their user ID while excluding the password field
exports.getUserById = async (userId) => {
    const user = await User.findOne({ _id: userId }, "-password");
    return user;
}
