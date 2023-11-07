const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// Creating a Mongoose schema for users
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
        minLength: [3, "Name is too short, minimum 3 characters long."],
        maxLength: [30, "Name is too big, maximum 30 characters long"]
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: [true, "Email is required"],
        validate: {
            validator: (value) => {
                const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                const isEmail = pattern.test(value);
                return isEmail;
            },
            message: "Invalid email address"
        }
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password should be at least 6 characters long."],
    }
}, {
    timestamps: true
})

// hashing password
userSchema.pre("save", function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

// comparing password
userSchema.methods.comparePassword = function (password, hashPassword) {
    const isMatchedPassword = bcrypt.compareSync(password, hashPassword);
    return isMatchedPassword;
}

// Creating a Mongoose model named 'User' based on the userSchema
const User = model("User", userSchema);

// Exporting the User model
module.exports = User;