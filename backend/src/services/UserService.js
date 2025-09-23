class UserService {
  constructor(userRepository, followRepository) {
    if (!userRepository) {
      throw new Error('UserRepository is required for UserService');
    }
    if (!followRepository) {
      throw new Error('FollowRepository is required for UserService');
    }
    this.userRepository = userRepository;
    this.followRepository = followRepository;
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const user = await this.userRepository.getPublicProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      // Validate update data
      this.validateProfileUpdate(updateData);

      // Check if username is being changed and if it's available
      if (updateData.username) {
        const existingUser = await this.userRepository.findByUsername(updateData.username);
        if (existingUser && existingUser.id !== userId) {
          throw new Error('Username already taken');
        }
      }

      // Update user
      const updatedUser = await this.userRepository.update(userId, updateData);
      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Follow user
  async followUser(followerId, followingId) {
    try {
      // Check if users exist
      const follower = await this.userRepository.findById(followerId);
      const following = await this.userRepository.findById(followingId);

      if (!follower || !following) {
        throw new Error('User not found');
      }

      // Create follow relationship
      await this.followRepository.followUser(followerId, followingId);

      // Update counters
      await this.userRepository.updateCounters(followerId);
      await this.userRepository.updateCounters(followingId);

      return { message: 'User followed successfully' };
    } catch (error) {
      throw new Error(`Failed to follow user: ${error.message}`);
    }
  }

  // Unfollow user
  async unfollowUser(followerId, followingId) {
    try {
      // Unfollow user
      await this.followRepository.unfollowUser(followerId, followingId);

      // Update counters
      await this.userRepository.updateCounters(followerId);
      await this.userRepository.updateCounters(followingId);

      return { message: 'User unfollowed successfully' };
    } catch (error) {
      throw new Error(`Failed to unfollow user: ${error.message}`);
    }
  }

  // Get user followers
  async getFollowers(userId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const followers = await this.userRepository.getFollowers(userId, limit, offset);
      return {
        followers,
        page,
        limit,
        hasMore: followers.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get followers: ${error.message}`);
    }
  }

  // Get user following
  async getFollowing(userId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const following = await this.userRepository.getFollowing(userId, limit, offset);
      return {
        following,
        page,
        limit,
        hasMore: following.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get following: ${error.message}`);
    }
  }

  // Search users
  async searchUsers(searchTerm, page = 1, limit = 20) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Search term must be at least 2 characters');
      }

      const offset = (page - 1) * limit;
      const users = await this.userRepository.searchUsers(searchTerm.trim(), limit, offset);
      
      return {
        users,
        page,
        limit,
        hasMore: users.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  // Get follow suggestions
  async getFollowSuggestions(userId, limit = 10) {
    try {
      const suggestions = await this.followRepository.getFollowSuggestions(userId, limit);
      return suggestions;
    } catch (error) {
      throw new Error(`Failed to get follow suggestions: ${error.message}`);
    }
  }

  // Check if user is following another user
  async checkFollowStatus(followerId, followingId) {
    try {
      const isFollowing = await this.followRepository.isFollowing(followerId, followingId);
      return { isFollowing };
    } catch (error) {
      throw new Error(`Failed to check follow status: ${error.message}`);
    }
  }

  // Get mutual follows
  async getMutualFollows(userId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const mutualFollows = await this.followRepository.getMutualFollows(userId, limit, offset);
      
      return {
        mutualFollows,
        page,
        limit,
        hasMore: mutualFollows.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get mutual follows: ${error.message}`);
    }
  }

  // Validate profile update data
  validateProfileUpdate(updateData) {
    const allowedFields = ['username', 'full_name', 'bio', 'location', 'website', 'birth_date'];
    
    // Check for invalid fields
    const invalidFields = Object.keys(updateData).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
    }

    // Validate username
    if (updateData.username !== undefined) {
      if (!updateData.username || updateData.username.length < 3 || updateData.username.length > 50) {
        throw new Error('Username must be between 3 and 50 characters');
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(updateData.username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
      }
    }

    // Validate full_name
    if (updateData.full_name !== undefined) {
      if (!updateData.full_name || updateData.full_name.trim().length < 1) {
        throw new Error('Full name cannot be empty');
      }
      
      if (updateData.full_name.length > 100) {
        throw new Error('Full name must not exceed 100 characters');
      }
    }

    // Validate bio
    if (updateData.bio !== undefined && updateData.bio.length > 160) {
      throw new Error('Bio must not exceed 160 characters');
    }

    // Validate location
    if (updateData.location !== undefined && updateData.location.length > 100) {
      throw new Error('Location must not exceed 100 characters');
    }

    // Validate website
    if (updateData.website !== undefined && updateData.website) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(updateData.website)) {
        throw new Error('Website must be a valid URL starting with http:// or https://');
      }
      
      if (updateData.website.length > 255) {
        throw new Error('Website URL must not exceed 255 characters');
      }
    }

    // Validate birth_date
    if (updateData.birth_date !== undefined && updateData.birth_date) {
      const birthDate = new Date(updateData.birth_date);
      const today = new Date();
      const minAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
      
      if (isNaN(birthDate.getTime())) {
        throw new Error('Invalid birth date format');
      }
      
      if (birthDate > minAge) {
        throw new Error('You must be at least 13 years old');
      }
      
      if (birthDate < new Date(1900, 0, 1)) {
        throw new Error('Invalid birth date');
      }
    }
  }
}

module.exports = UserService;