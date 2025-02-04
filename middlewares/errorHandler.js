

// Middleware to handle errors in the routes
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err);

    // Set the status code, default to 500 if not provided
    const status = err.status || 500;

    // Set the error message, default to a generic message if not provided
    const message = err.message || 'Something went wrong';

    // Send the error response
    res.status(status).json({
        message: message,
        // Include the stack trace only in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}

// Export the error handler middleware
export default errorHandler;