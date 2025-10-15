class PostService {
  constructor(postRepository, likeRepository, userRepository, notificationService = null, followRepository = null) {
    if (!postRepository) {
      throw new Error('PostRepository is required for PostService');
    }
    if (!likeRepository) {
      throw new Error('LikeRepository is required for PostService');
    }
    if (!userRepository) {
      throw new Error('UserRepository is required for PostService');
    }
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
    this.userRepository = userRepository;
    this.notificationService = notificationService; // Optional for now
    this.followRepository = followRepository; // Optional
  }

  // Create new post
  async createPost(userId, postData) {
    try {
      console.log('🔍 Creating post for user:', userId, 'with data:', postData);
      
      // Validate post data
      this.validatePostData(postData);

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      console.log('✅ User found:', user.username);

      // Create post
      const newPost = await this.postRepository.create({
        user_id: userId,
        content: postData.content.trim(),
        image: postData.image || null
      });
      console.log('✅ Post created with ID:', newPost.id);

      // Update user's post count
      await this.userRepository.updateCounters(userId);

      // Notify followers about new post (async, don't wait)
      if (this.notificationService && this.followRepository) {
        this.notificationService.notifyNewPost(userId, newPost.id, this.followRepository)
          .catch(err => console.error('Error notifying followers:', err));
      }

      // Get post with user info
      const postWithUser = await this.postRepository.getPostWithUser(newPost.id);
      console.log('✅ Post with user info retrieved:', postWithUser.id);
      return postWithUser;
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  // Get post by ID
  async getPost(postId, currentUserId = null) {
    try {
      const post = await this.postRepository.getPostWithUser(postId, currentUserId);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    } catch (error) {
      throw new Error(`Failed to get post: ${error.message}`);
    }
  }

  // Update post
  async updatePost(postId, userId, updateData) {
    try {
      // Get existing post
      const existingPost = await this.postRepository.findById(postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Check if user owns the post
      if (existingPost.user_id !== userId) {
        throw new Error('You can only edit your own posts');
      }

      // Validate update data
      this.validatePostData(updateData);

      // Update post
      const updatedPost = await this.postRepository.update(postId, {
        content: updateData.content.trim(),
        image: updateData.image || existingPost.image
      });

      // Get post with user info
      const postWithUser = await this.postRepository.getPostWithUser(postId);
      return postWithUser;
    } catch (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }
  }

  // Delete post
  async deletePost(postId, userId) {
    try {
      // Get existing post
      const existingPost = await this.postRepository.findById(postId);
      if (!existingPost) {
        throw new Error('Post not found');
      }

      // Check if user owns the post
      if (existingPost.user_id !== userId) {
        throw new Error('You can only delete your own posts');
      }

      // Delete post
      await this.postRepository.delete(postId);

      // Update user's post count
      await this.userRepository.updateCounters(userId);

      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }

  // Get user's feed (from followed users only)
  async getFollowingFeed(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const posts = await this.postRepository.getFollowingFeed(userId, limit, offset);
      
      return {
        posts,
        page,
        limit,
        hasMore: posts.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get following feed: ${error.message}`);
    }
  }

  // Get user's feed
  async getFeed(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const posts = await this.postRepository.getFeedPosts(userId, limit, offset);
      
      return {
        posts,
        page,
        limit,
        hasMore: posts.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get feed: ${error.message}`);
    }
  }

  // Get user's posts
  async getUserPosts(userId, page = 1, limit = 20, currentUserId = null) {
    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const offset = (page - 1) * limit;
      const posts = await this.postRepository.getUserPosts(userId, limit, offset, currentUserId);
      
      return {
        posts,
        page,
        limit,
        hasMore: posts.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get user posts: ${error.message}`);
    }
  }

  // Get public timeline
  async getPublicTimeline(page = 1, limit = 20, currentUserId = null) {
    try {
      const offset = (page - 1) * limit;
      const posts = await this.postRepository.getPublicTimeline(limit, offset, currentUserId);
      
      return {
        posts,
        page,
        limit,
        hasMore: posts.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get public timeline: ${error.message}`);
    }
  }

  // Like post
  async likePost(postId, userId) {
    try {
      // Check if post exists
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Like the post
      await this.likeRepository.likePost(postId, userId);

      // Update post counters
      await this.postRepository.updateCounters(postId);

      // Create notification for post owner
      if (this.notificationService && post.user_id !== userId) {
        await this.notificationService.notifyLike(post.user_id, userId, postId);
      }

      return { message: 'Post liked successfully' };
    } catch (error) {
      throw new Error(`Failed to like post: ${error.message}`);
    }
  }

  // Unlike post
  async unlikePost(postId, userId) {
    try {
      // Check if post exists
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Unlike the post
      await this.likeRepository.unlikePost(postId, userId);

      // Update post counters
      await this.postRepository.updateCounters(postId);

      // Remove notification for post owner
      if (this.notificationService && post.user_id !== userId) {
        await this.notificationService.removeNotifyLike(post.user_id, userId, postId);
      }

      return { message: 'Post unliked successfully' };
    } catch (error) {
      throw new Error(`Failed to unlike post: ${error.message}`);
    }
  }

  // Get post likes
  async getPostLikes(postId, page = 1, limit = 50) {
    try {
      // Check if post exists
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      const offset = (page - 1) * limit;
      const likes = await this.likeRepository.getPostLikes(postId, limit, offset);
      
      return {
        likes,
        page,
        limit,
        hasMore: likes.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get post likes: ${error.message}`);
    }
  }

  // Get user's liked posts
  async getUserLikedPosts(userId, page = 1, limit = 20) {
    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const offset = (page - 1) * limit;
      const likedPosts = await this.likeRepository.getUserLikedPosts(userId, limit, offset);
      
      return {
        posts: likedPosts,
        page,
        limit,
        hasMore: likedPosts.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get user liked posts: ${error.message}`);
    }
  }

  // Search posts
  async searchPosts(searchTerm, page = 1, limit = 20) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Search term must be at least 2 characters');
      }

      const offset = (page - 1) * limit;
      const posts = await this.postRepository.searchPosts(searchTerm.trim(), limit, offset);
      
      return {
        posts,
        page,
        limit,
        hasMore: posts.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to search posts: ${error.message}`);
    }
  }

  // Check if user liked a post
  async checkLikeStatus(postId, userId) {
    try {
      const isLiked = await this.likeRepository.isPostLikedByUser(postId, userId);
      return { isLiked };
    } catch (error) {
      throw new Error(`Failed to check like status: ${error.message}`);
    }
  }

  // Validate post data
  validatePostData(postData) {
    if (!postData.content || typeof postData.content !== 'string') {
      throw new Error('Post content is required');
    }

    const content = postData.content.trim();
    if (content.length === 0) {
      throw new Error('Post content cannot be empty');
    }

    if (content.length > 280) {
      throw new Error('Post content must not exceed 280 characters');
    }

    // Validate image URL if provided
    if (postData.image && typeof postData.image === 'string') {
      if (postData.image.length > 255) {
        throw new Error('Image URL must not exceed 255 characters');
      }
      
      // Basic URL validation
      try {
        new URL(postData.image);
      } catch {
        throw new Error('Invalid image URL format');
      }
    }
  }
}

module.exports = PostService;