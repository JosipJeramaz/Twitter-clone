// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error('Stack:', err.stack);

  // Default error response
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  let statusCode = 500;

  // Handle specific error types
  
  // Validation errors
  if (err.message.includes('must be') || 
      err.message.includes('is required') || 
      err.message.includes('Invalid') ||
      err.message.includes('cannot be empty') ||
      err.message.includes('must not exceed')) {
    statusCode = 400;
  }

  // Authentication errors
  if (err.message.includes('Invalid email or password') ||
      err.message.includes('Token') ||
      err.message.includes('Unauthorized') ||
      err.message.includes('Access denied')) {
    statusCode = 401;
  }

  // Permission errors
  if (err.message.includes('can only') ||
      err.message.includes('not allowed') ||
      err.message.includes('Permission denied')) {
    statusCode = 403;
  }

  // Not found errors
  if (err.message.includes('not found') ||
      err.message.includes('does not exist')) {
    statusCode = 404;
  }

  // Conflict errors
  if (err.message.includes('already exists') ||
      err.message.includes('already taken') ||
      err.message.includes('Already following') ||
      err.message.includes('already liked')) {
    statusCode = 409;
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED' || 
      err.code === 'ER_ACCESS_DENIED_ERROR' ||
      err.code === 'ENOTFOUND') {
    statusCode = 503;
    error.message = 'Database connection failed';
  }

  // MySQL specific errors
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    error.message = 'Duplicate entry - resource already exists';
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    error.message = 'Referenced resource does not exist';
  }

  if (err.code === 'ER_DATA_TOO_LONG') {
    statusCode = 400;
    error.message = 'Data too long for field';
  }

  // JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error.message = 'Token expired';
  }

  // Rate limiting errors
  if (err.status === 429) {
    statusCode = 429;
    error.message = 'Too many requests';
  }

  res.status(statusCode).json(error);
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// Async error wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};