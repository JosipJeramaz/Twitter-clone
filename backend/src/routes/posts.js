const express = require('express');
const { PostController } = require('../controllers');
const auth = require('../middleware/auth');
const { 
  createPostValidation,
  updatePostValidation,
  idValidation,
  userIdValidation,
  paginationValidation,
  searchValidation
} = require('../middleware/validation');

const router = express.Router();

// Create new post
router.post('/', auth, createPostValidation, PostController.createPost);

// Get public timeline
router.get('/timeline', paginationValidation, PostController.getPublicTimeline);

// Get user's feed (following posts)
router.get('/feed', auth, paginationValidation, PostController.getFeed);

// Search posts
router.get('/search', searchValidation, paginationValidation, PostController.searchPosts);

// Get post by ID
router.get('/:id', idValidation, PostController.getPost);

// Update post
router.put('/:id', auth, idValidation, updatePostValidation, PostController.updatePost);

// Delete post
router.delete('/:id', auth, idValidation, PostController.deletePost);

// Like post
router.post('/:id/like', auth, idValidation, PostController.likePost);

// Unlike post
router.delete('/:id/like', auth, idValidation, PostController.unlikePost);

// Get post likes
router.get('/:id/likes', idValidation, paginationValidation, PostController.getPostLikes);

// Check like status
router.get('/:id/like-status', auth, idValidation, PostController.checkLikeStatus);

// Get user's posts
router.get('/user/:userId', userIdValidation, paginationValidation, PostController.getUserPosts);

// Get user's liked posts
router.get('/user/:userId/liked', userIdValidation, paginationValidation, PostController.getUserLikedPosts);

module.exports = router;