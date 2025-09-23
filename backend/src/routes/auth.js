const express = require('express');
const auth = require('../middleware/auth');
const { 
  registerValidation, 
  loginValidation, 
  changePasswordValidation 
} = require('../middleware/validation');

/**
 * Create auth routes with dependency injection
 * @param {DIContainer} container - The DI container
 * @returns {Router} Express router with auth routes
 */
function createAuthRoutes(container) {
  const router = express.Router();
  const authController = container.resolve('authController');

  // Register
  router.post('/register', registerValidation, authController.register);

  // Login
  router.post('/login', loginValidation, authController.login);

  // Verify token
  router.get('/verify', authController.verifyToken);

  // Change password
  router.put('/change-password', auth, changePasswordValidation, authController.changePassword);

  // Logout (client-side token removal)
  router.post('/logout', authController.logout);

  return router;
}

module.exports = createAuthRoutes;