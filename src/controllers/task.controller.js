const createError = require("http-errors");
const { getUserByEmail } = require("../services/user.service");
const { successResponse } = require("../utils/response");
const {
    createTaskService,
    updateTaskService,
    getTaskService,
    deleteTaskService,
    getTasksService
} = require("../services/task.service");

// Get a list of tasks with filtering, pagination, and sorting
exports.getTasks = async (req, res, next) => {
    try {
        let {
            search = '',
            page = 1,
            limit = 10,
            sort = '-createdAt',
            field = '',
            ...filterObject
        } = req.query;

        // Convert the filter object to JSON and then parse it
        filterObject = JSON.stringify(filterObject);
        filterObject = JSON.parse(filterObject);

        let filters = {
            ...filterObject
        };

        // Apply title search if 'search' parameter is provided
        if (search) {
            const searchRegex = new RegExp(".*" + search + ".*", "i");

            filters = {
                ...filterObject,
                $or: [{ title: { $regex: searchRegex } }]
            }
        }

        // Convert sort and field parameters into appropriate format
        if (sort) sort = sort.split(',').join(' ');
        if (field) field = field.split(',').join(' ');

        // Retrieve tasks based on filters, pagination, sorting, and field selection
        const { tasks, pagination } = await getTasksService(filters, page, limit, sort, field);

        // Send the response with tasks and pagination details
        successResponse(res, {
            status: 200,
            message: "All tasks returned",
            payload: { pagination, tasks }
        });
    }
    catch (err) {
        next(err);
    }
};

// Get a task by its ID
exports.getTask = async (req, res, next) => {
    try {
        // Retrieve a task using the provided task ID
        const task = await getTaskService(req.params.taskId);

        // Check if the task does not exist and throw a 404 error
        if (!task)
            throw createError(404, "Task not found.");

        // Send the response with the task
        successResponse(res, {
            status: 200,
            message: "Task returned by id",
            payload: { task }
        });
    }
    catch (err) {
        next(err);
    }
};

// Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, completed } = req.body;

        if (!title)
            throw createError(404, "Title is requred.");

        if (title.length < 3)
            throw createError(404, "Title is too short, minimum 3 characters long.");

        if (title.length > 60)
            throw createError(404, "Title is too big, maximum 60 characters long.");

        if (!description)
            throw createError(404, "Description is requred.");

        if (description.length < 10)
            throw createError(404, "Description is too short, minimum 10 characters long.");

        if (description.length > 500)
            throw createError(404, "Description is too big, maximum 500 characters long.");

        // Fetch the user by email
        const user = await getUserByEmail(req.user?.email);

        const data = {
            title,
            description,
            completed,
            creatorId: user._id,
        };

        // Create a new task
        const task = await createTaskService(data);

        // Send the response with the created task
        successResponse(res, {
            status: 200,
            message: "New task created successfully",
            payload: { task }
        });
    }
    catch (err) {
        next(err);
    }
};

// Update an existing task
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, completed } = req.body;

        if (!title)
            throw createError(404, "Title is requred.");

        if (title.length < 3)
            throw createError(404, "Title is too short, minimum 3 characters long.");

        if (title.length > 100)
            throw createError(404, "Title is too big, maximum 100 characters long.");

        if (!description)
            throw createError(404, "Description is requred.");

        if (description.length < 10)
            throw createError(404, "Description is too short, minimum 10 characters long.");

        if (description.length > 500)
            throw createError(404, "Description is too big, maximum 500 characters long.");

        const data = {
            title,
            description,
            completed,
        };

        // Update the task by its ID with the provided data
        const result = await updateTaskService(req.params.taskId, data);

        // Check if the task was updated
        if (result.matchedCount === 0)
            throw createError(400, "Failed to update the task");

        // Send the response with the update result
        successResponse(res, {
            status: 200,
            message: "Task updated successfully",
            payload: { result }
        });
    }
    catch (err) {
        next(err);
    }
};

// Delete a task by its ID
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await getTaskService(req.params.taskId);

        if (!task)
            throw createError(404, "Task is not exist");

        // Delete the task by its ID
        const result = await deleteTaskService(req.params.taskId);

        // Check if the task was deleted
        if (result.deletedCount === 0)
            throw createError(400, "Failed to delete the task");

        // Send the response with the deletion result
        successResponse(res, {
            status: 200,
            message: "Task deleted successfully",
            payload: { result }
        });
    }
    catch (err) {
        next(err);
    }
};