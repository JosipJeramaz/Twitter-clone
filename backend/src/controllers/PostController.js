class PostController {
  constructor(postService) {
    this.postService = postService;
  }

  // Create new post
  createPost = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const post = await this.postService.createPost(userId, req.body);
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: { post }
      });
    } catch (error) {
      next(error);
    }
  };

  // Get post by ID
  getPost = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const currentUserId = req.user?.id;

      const post = await this.postService.getPost(postId, currentUserId);
      
      res.status(200).json({
        success: true,
        data: { post }
      });
    } catch (error) {
      next(error);
    }
  };

  // Update post
  updatePost = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;

      const post = await this.postService.updatePost(postId, userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: { post }
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete post
  deletePost = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.postService.deletePost(postId, userId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user's feed
  getFeed = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.postService.getFeed(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user's posts
  getUserPosts = async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId) || req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const currentUserId = req.user?.id; // Get from auth middleware if user is authenticated

      const result = await this.postService.getUserPosts(userId, page, limit, currentUserId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get public timeline
  getPublicTimeline = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const currentUserId = req.user?.id; // Get from auth middleware if user is authenticated

      const result = await this.postService.getPublicTimeline(page, limit, currentUserId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Like post
  likePost = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.postService.likePost(postId, userId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // Unlike post
  unlikePost = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.postService.unlikePost(postId, userId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // Get post likes
  getPostLikes = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await this.postService.getPostLikes(postId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user's liked posts
  getUserLikedPosts = async (req, res, next) => {
    try {
      const userId = parseInt(req.params.userId) || req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.postService.getUserLikedPosts(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Search posts
  searchPosts = async (req, res, next) => {
    try {
      const { q: searchTerm } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await this.postService.searchPosts(searchTerm, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Check like status
  checkLikeStatus = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.postService.checkLikeStatus(postId, userId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostController;