class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // Get user profile
  getProfile = async (req, res, next) => {
    try {
      const userId = req.params.id || req.user.id;
      const user = await this.userService.getUserProfile(userId);
      
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user profile
  updateProfile = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updatedUser = await this.userService.updateProfile(userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      next(error);
    }
  };

  // Follow user
  followUser = async (req, res, next) => {
    try {
      const followerId = req.user.id;
      const followingId = parseInt(req.params.id);

      if (followerId === followingId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot follow yourself'
        });
      }

      const result = await this.userService.followUser(followerId, followingId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // Unfollow user
  unfollowUser = async (req, res, next) => {
    try {
      const followerId = req.user.id;
      const followingId = parseInt(req.params.id);

      const result = await this.userService.unfollowUser(followerId, followingId);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user followers
  getFollowers = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await this.userService.getFollowers(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user following
  getFollowing = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await this.userService.getFollowing(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Search users
  searchUsers = async (req, res, next) => {
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

      const result = await this.userService.searchUsers(searchTerm, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get follow suggestions
  getFollowSuggestions = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      const suggestions = await this.userService.getFollowSuggestions(userId, limit);
      
      res.status(200).json({
        success: true,
        data: { suggestions }
      });
    } catch (error) {
      next(error);
    }
  };

  // Check follow status
  checkFollowStatus = async (req, res, next) => {
    try {
      const followerId = req.user.id;
      const followingId = parseInt(req.params.id);

      const result = await this.userService.checkFollowStatus(followerId, followingId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Get mutual follows
  getMutualFollows = async (req, res, next) => {
    try {
      const userId = req.params.id || req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await this.userService.getMutualFollows(userId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;