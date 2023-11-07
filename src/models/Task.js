const { Schema, model } = require("mongoose");

// Creating a Mongoose schema for tasks
const taskSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"],
        minLength: [3, "Title is too short, minimum 3 characters long."],
        maxLength: [60, "Title is too big, maximum 60 characters long"]
    },

    description: {
        type: String,
        trim: true,
        required: [true, "Description is required"],
        minLength: [10, "Description is too short, minimum 10 characters long."],
        maxLength: [500, "Description is too big, maximum 500 characters long"]
    },

    completed: {
        type: Boolean,
        default: false
    },

    creatorId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

// Creating a Mongoose model named 'Task' based on the taskSchema
const Task = model("Task", taskSchema);

// Exporting the Task model
module.exports = Task;