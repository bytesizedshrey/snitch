import { config } from '../config/config.js';

export const errorHandler = (err, req, res, next) => {
    // Determine status code (default to 500 Internal Server Error)
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Provide generic message for client, log actual error on server
    const message = err.message || 'Internal Server Error';
    
    // Log error internally 
    console.error(`[Error] ${statusCode} - ${message}\nStack: ${err.stack}`);

    // Send formatted JSON response
    res.json({
        success: false,
        message: message,
        // In production, we NEVER leak the stack trace to the client!
        stack: config.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};
