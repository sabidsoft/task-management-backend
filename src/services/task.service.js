const Task = require("../models/Task");

// Function to retrieve a list of tasks based on filters, pagination, sorting, and field selection
exports.getTasksService = async (filters, page, limit, sort, field) => {
    // Convert page and limit to integers
    page = parseInt(page);
    limit = parseInt(limit);

    // Fetch tasks based on provided filters, sorting, pagination, and field selection
    const tasks = await Task
        .find(filters)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select(field);

    // Get the total count of documents based on filters
    const totalDocuments = await Task.countDocuments(filters);

    // Calculate pagination details
    const pagination = {
        totalPage: Math.ceil(totalDocuments / limit),
        currentPage: page,
        previousPage: page - 1 === 0 ? null : page - 1,
        nextPage: page + 1 <= Math.ceil(totalDocuments / limit) ? page + 1 : null
    }

    // Adjust pagination values if the current page exceeds the total pages
    if (pagination.currentPage > pagination.totalPage) {
        pagination.currentPage = null;
        pagination.previousPage = null;
        pagination.nextPage = null;
    }

    // Return the fetched tasks and pagination information
    return { tasks, pagination };
};

// Function to retrieve a task by its ID
exports.getTaskService = async (taskId) => {
    const task = await Task.findOne({ _id: taskId });
    return task;
};

// Function to create a new task
exports.createTaskService = async (data) => {
    const task = await Task.create(data);
    return task;
};

// Function to delete a task by its ID
exports.deleteTaskService = async (taskId) => {
    const result = await Task.deleteOne({ _id: taskId });
    return result;
};

// Function to update a task by its ID with the provided data
exports.updateTaskService = async (taskId, data) => {
    const result = await Task.updateOne({ _id: taskId }, { $set: data }, { runValidators: true });
    return result;
};
