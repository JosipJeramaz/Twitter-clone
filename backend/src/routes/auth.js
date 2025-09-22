const express = require('express');
const { AuthController } = require('../controllers');
const auth = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation, 
  changePasswordValidation 
} = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', registerValidation, AuthController.register);

// Login
router.post('/login', loginValidation, AuthController.login);

// Verify token
router.get('/verify', AuthController.verifyToken);

// Change password
router.put('/change-password', auth, changePasswordValidation, AuthController.changePassword);

// Logout (client-side token removal)
router.post('/logout', AuthController.logout);

module.exports = router;