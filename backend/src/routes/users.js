const express = require('express');
const auth = require('../middleware/auth');
const { 
  updateProfileValidation,
  idValidation,
  userIdValidation,
  paginationValidation,
  searchValidation
} = require('../middleware/validation');

/**
 * Create user routes with dependency injection
 * @param {DIContainer} container - The DI container
 * @returns {Router} Express router with user routes
 */
function createUserRoutes(container) {
  const router = express.Router();
  const userController = container.resolve('userController');

  // Get current user profile
  router.get('/me', auth, userController.getProfile);

  // Update current user profile
  router.put('/me', auth, updateProfileValidation, userController.updateProfile);

  // Get user profile by username
  router.get('/username/:username', userController.getProfileByUsername);

  // Get user profile by ID
  router.get('/:id', idValidation, userController.getProfile);

  // Follow user
  router.post('/:id/follow', auth, idValidation, userController.followUser);

  // Unfollow user
  router.delete('/:id/follow', auth, idValidation, userController.unfollowUser);

  // Get user followers
  router.get('/:id/followers', idValidation, paginationValidation, userController.getFollowers);

  // Get user following
  router.get('/:id/following', idValidation, paginationValidation, userController.getFollowing);

  // Check follow status
  router.get('/:id/follow-status', auth, idValidation, userController.checkFollowStatus);

  // Get mutual follows
  router.get('/:id/mutual', idValidation, paginationValidation, userController.getMutualFollows);

  // Search users
  router.get('/search/users', searchValidation, paginationValidation, userController.searchUsers);

  // Get follow suggestions
  router.get('/suggestions/follow', auth, userController.getFollowSuggestions);

  return router;
}

module.exports = createUserRoutes;