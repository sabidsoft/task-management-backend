// Function to send an error response
exports.errorResponse = (res, {
    status = 500,
    message = "Internal server error"
}) => {
    res.status(status).json({
        success: false,
        message,
    });
};

// Function to send a success response
exports.successResponse = (res, {
    status = 200,
    message = "Success", payload = {}
}) => {
    res.status(status).json({
        success: true,
        message,
        data: payload
    });
};