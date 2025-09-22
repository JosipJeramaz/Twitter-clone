const express = require('express');
const { UserController } = require('../controllers');
const auth = require('../middleware/auth');
const { 
  updateProfileValidation,
  idValidation,
  userIdValidation,
  paginationValidation,
  searchValidation
} = require('../middleware/validation');

const router = express.Router();

// Get current user profile
router.get('/me', auth, UserController.getProfile);

// Update current user profile
router.put('/me', auth, updateProfileValidation, UserController.updateProfile);

// Get user profile by ID
router.get('/:id', idValidation, UserController.getProfile);

// Follow user
router.post('/:id/follow', auth, idValidation, UserController.followUser);

// Unfollow user
router.delete('/:id/follow', auth, idValidation, UserController.unfollowUser);

// Get user followers
router.get('/:id/followers', idValidation, paginationValidation, UserController.getFollowers);

// Get user following
router.get('/:id/following', idValidation, paginationValidation, UserController.getFollowing);

// Check follow status
router.get('/:id/follow-status', auth, idValidation, UserController.checkFollowStatus);

// Get mutual follows
router.get('/:id/mutual', idValidation, paginationValidation, UserController.getMutualFollows);

// Search users
router.get('/search/users', searchValidation, paginationValidation, UserController.searchUsers);

// Get follow suggestions
router.get('/suggestions/follow', auth, UserController.getFollowSuggestions);

module.exports = router;