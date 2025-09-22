// Input validation middleware
const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Auth validation rules
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  
  body('full_name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Full name must be between 1 and 100 characters'),
  
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/(?=.*[a-zA-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one letter and one number'),
  
  handleValidationErrors
];

// User validation rules
const updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Full name must be between 1 and 100 characters'),
  
  body('bio')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Bio must not exceed 160 characters'),
  
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL')
    .isLength({ max: 255 })
    .withMessage('Website URL must not exceed 255 characters'),
  
  body('birth_date')
    .optional()
    .isISO8601()
    .withMessage('Birth date must be a valid date')
    .custom(value => {
      const birthDate = new Date(value);
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
      
      if (birthDate > minAge) {
        throw new Error('You must be at least 13 years old');
      }
      
      if (birthDate < new Date(1900, 0, 1)) {
        throw new Error('Invalid birth date');
      }
      
      return true;
    }),
  
  handleValidationErrors
];

// Post validation rules
const createPostValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Post content must be between 1 and 280 characters'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
    .isLength({ max: 255 })
    .withMessage('Image URL must not exceed 255 characters'),
  
  handleValidationErrors
];

const updatePostValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 280 })
    .withMessage('Post content must be between 1 and 280 characters'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL')
    .isLength({ max: 255 })
    .withMessage('Image URL must not exceed 255 characters'),
  
  handleValidationErrors
];

// Parameter validation rules
const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  handleValidationErrors
];

const userIdValidation = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  handleValidationErrors
];

// Query validation rules
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const searchValidation = [
  query('q')
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters')
    .trim(),
  
  handleValidationErrors
];

module.exports = {
  // Auth validations
  registerValidation,
  loginValidation,
  changePasswordValidation,
  
  // User validations
  updateProfileValidation,
  
  // Post validations
  createPostValidation,
  updatePostValidation,
  
  // Parameter validations
  idValidation,
  userIdValidation,
  
  // Query validations
  paginationValidation,
  searchValidation,
  
  // Helper
  handleValidationErrors
};