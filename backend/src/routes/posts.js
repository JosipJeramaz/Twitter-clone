const express = require('express');
const auth = require('../middleware/auth');
const { 
  createPostValidation,
  updatePostValidation,
  idValidation,
  userIdValidation,
  paginationValidation,
  searchValidation
} = require('../middleware/validation');

/**
 * Create post routes with dependency injection
 * @param {DIContainer} container - The DI container
 * @returns {Router} Express router with post routes
 */
function createPostRoutes(container) {
  const router = express.Router();
  const postController = container.resolve('postController');

  // Create new post
  router.post('/', auth, createPostValidation, postController.createPost);

  // Get public timeline
  router.get('/timeline', paginationValidation, postController.getPublicTimeline);

  // Get user's feed (following posts)
  router.get('/feed', auth, paginationValidation, postController.getFeed);

  // Search posts
  router.get('/search', searchValidation, paginationValidation, postController.searchPosts);

  // Get post by ID
  router.get('/:id', idValidation, postController.getPost);

  // Update post
  router.put('/:id', auth, idValidation, updatePostValidation, postController.updatePost);

  // Delete post
  router.delete('/:id', auth, idValidation, postController.deletePost);

  // Like post
  router.post('/:id/like', auth, idValidation, postController.likePost);

  // Unlike post
  router.delete('/:id/like', auth, idValidation, postController.unlikePost);

  // Get post likes
  router.get('/:id/likes', idValidation, paginationValidation, postController.getPostLikes);

  // Check like status
  router.get('/:id/like-status', auth, idValidation, postController.checkLikeStatus);

  // Get user's posts
  router.get('/user/:userId', userIdValidation, paginationValidation, postController.getUserPosts);

  // Get user's liked posts
  router.get('/user/:userId/liked', userIdValidation, paginationValidation, postController.getUserLikedPosts);

  return router;
}

module.exports = createPostRoutes;