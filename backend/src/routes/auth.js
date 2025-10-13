const express = require('express');
const auth = require('../middleware/auth');
const { passport } = require('../config/passport');
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

  // Check if OAuth strategies are configured
  const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
                              process.env.GOOGLE_CLIENT_SECRET && 
                              process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here';
  
  const isAppleConfigured = process.env.APPLE_CLIENT_ID && 
                            process.env.APPLE_TEAM_ID && 
                            process.env.APPLE_CLIENT_ID !== 'your_apple_client_id_here';

  // Google OAuth routes
  if (isGoogleConfigured) {
    router.get('/google', 
      passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false 
      })
    );

    router.get('/google/callback',
      passport.authenticate('google', { 
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
      }),
      authController.googleCallback
    );
  } else {
    router.get('/google', (req, res) => {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=Google OAuth is not configured on this server`);
    });
    
    router.get('/google/callback', (req, res) => {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_not_configured`);
    });
  }

  // Apple OAuth routes
  if (isAppleConfigured) {
    router.get('/apple',
      passport.authenticate('apple', {
        scope: ['name', 'email'],
        session: false
      })
    );

    router.post('/apple/callback',
      passport.authenticate('apple', {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`
      }),
      authController.appleCallback
    );
  } else {
    router.get('/apple', (req, res) => {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=Apple OAuth is not configured on this server`);
    });
    
    router.post('/apple/callback', (req, res) => {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_not_configured`);
    });
  }

  return router;
}

module.exports = createAuthRoutes;