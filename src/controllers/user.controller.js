const createError = require("http-errors");
const { getUserByEmail, signupService } = require("../services/user.service");
const { generateToken } = require("../utils/generateToken");
const { successResponse } = require("../utils/response");

// User sign-up functionality
exports.signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!name)
            throw createError(400, "Name is required.");

        if (name.length < 3)
            throw createError(400, "Name is too short.");

        if (name.length > 30)
            throw createError(400, "Name is too big.");

        if (!email)
            throw createError(400, "Email is required.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        if (!password)
            throw createError(400, "Password is required.");

        if (password.length < 6)
            throw createError(400, "Password should be at least 6 characters long.");

        if (password.length > 40)
            throw createError(400, "Password is too long.");

        const isUserExist = await getUserByEmail(email);

        if (isUserExist)
            throw createError(400, "User allready exist.");

        const user = await signupService(req.body);

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign up successfull.",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
};

// User sign-in functionality
exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const emailValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email)
            throw createError(400, "Please provide your email address.");

        if (!emailValidationPattern.test(email))
            throw createError(400, "Invalid email address.");

        if (!password)
            throw createError(400, "Please provide your password.");

        const user = await getUserByEmail(email);

        if (!user)
            throw createError(400, "Your email or password isn't correct.");

        const isMatchedPassword = user.comparePassword(password, user.password);

        if (!isMatchedPassword)
            throw createError(400, "Your email or password isn't correct.");

        const { password: pass, ...userInfoWithoutPassword } = user.toObject();

        const token = generateToken({ email }, process.env.JWT_SECRET_KEY, "365d");

        successResponse(res, {
            status: 200,
            message: "Sign in successfull.",
            payload: { user: userInfoWithoutPassword, token }
        })
    }
    catch (err) {
        next(err);
    }
}