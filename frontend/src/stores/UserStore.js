// UserStore.js - User profile and follow management
import { makeAutoObservable, runInAction } from 'mobx';
import { userService } from '../services/api';

class UserStore {
  users = new Map(); // userId -> user object
  currentProfile = null;
  following = [];
  followers = [];
  loading = false;
  error = null;
  
  // Track follow status for each user
  followStatus = new Map(); // userId -> boolean (true if following)
  followerCounts = new Map(); // userId -> number
  followingCounts = new Map(); // userId -> number

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Get user profile by username
  async fetchProfile(username) {
    this.loading = true;
    this.error = null;

    try {
      const response = await userService.getProfile(username);
      const profile = response.data.user;

      runInAction(() => {
        this.currentProfile = profile;
        this.users.set(profile.id, profile);
        this.followerCounts.set(profile.id, profile.followers_count || 0);
        this.followingCounts.set(profile.id, profile.following_count || 0);
        this.loading = false;
      });

      // Check if current user is following this profile
      const currentUser = this.rootStore.authStore.user;
      if (currentUser && currentUser.id !== profile.id) {
        await this.checkFollowStatus(profile.id);
      }

      return profile;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || error.message || 'Failed to load profile';
        this.loading = false;
      });
      throw error;
    }
  }

  // Check if current user is following a specific user
  async checkFollowStatus(userId) {
    try {
      const response = await userService.checkFollowStatus(userId);
      const isFollowing = response.data.isFollowing;

      runInAction(() => {
        this.followStatus.set(userId, isFollowing);
      });

      return isFollowing;
    } catch (error) {
      console.error('Failed to check follow status:', error);
      return false;
    }
  }

  // Follow a user
  async followUser(userId) {
    const currentUser = this.rootStore.authStore.user;
    if (!currentUser) {
      throw new Error('Must be logged in to follow users');
    }

    if (currentUser.id === userId) {
      throw new Error('Cannot follow yourself');
    }

    // Optimistic update
    const wasFollowing = this.followStatus.get(userId) || false;
    const currentFollowerCount = this.followerCounts.get(userId) || 0;

    runInAction(() => {
      this.followStatus.set(userId, true);
      this.followerCounts.set(userId, currentFollowerCount + 1);
    });

    try {
      await userService.followUser(userId);
      
      // Update current profile if it's the same user
      if (this.currentProfile?.id === userId) {
        runInAction(() => {
          this.currentProfile = {
            ...this.currentProfile,
            followers_count: currentFollowerCount + 1
          };
        });
      }
    } catch (error) {
      // Rollback on error
      runInAction(() => {
        this.followStatus.set(userId, wasFollowing);
        this.followerCounts.set(userId, currentFollowerCount);
        
        if (this.currentProfile?.id === userId) {
          this.currentProfile = {
            ...this.currentProfile,
            followers_count: currentFollowerCount
          };
        }
      });
      
      throw error;
    }
  }

  // Unfollow a user
  async unfollowUser(userId) {
    const currentUser = this.rootStore.authStore.user;
    if (!currentUser) {
      throw new Error('Must be logged in to unfollow users');
    }

    // Optimistic update
    const wasFollowing = this.followStatus.get(userId) || false;
    const currentFollowerCount = this.followerCounts.get(userId) || 0;

    runInAction(() => {
      this.followStatus.set(userId, false);
      this.followerCounts.set(userId, Math.max(0, currentFollowerCount - 1));
    });

    try {
      await userService.unfollowUser(userId);
      
      // Update current profile if it's the same user
      if (this.currentProfile?.id === userId) {
        runInAction(() => {
          this.currentProfile = {
            ...this.currentProfile,
            followers_count: Math.max(0, currentFollowerCount - 1)
          };
        });
      }
    } catch (error) {
      // Rollback on error
      runInAction(() => {
        this.followStatus.set(userId, wasFollowing);
        this.followerCounts.set(userId, currentFollowerCount);
        
        if (this.currentProfile?.id === userId) {
          this.currentProfile = {
            ...this.currentProfile,
            followers_count: currentFollowerCount
          };
        }
      });
      
      throw error;
    }
  }

  // Get followers list
  async fetchFollowers(userId, page = 1, limit = 50) {
    try {
      const response = await userService.getFollowers(userId, page, limit);
      
      runInAction(() => {
        this.followers = response.data.followers || [];
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch followers:', error);
      throw error;
    }
  }

  // Get following list
  async fetchFollowing(userId, page = 1, limit = 50) {
    try {
      const response = await userService.getFollowing(userId, page, limit);
      
      runInAction(() => {
        this.following = response.data.following || [];
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch following:', error);
      throw error;
    }
  }

  // Check if following a specific user
  isFollowing(userId) {
    return this.followStatus.get(userId) || false;
  }

  // Get follower count for a user
  getFollowerCount(userId) {
    return this.followerCounts.get(userId) || 0;
  }

  // Get following count for a user
  getFollowingCount(userId) {
    return this.followingCounts.get(userId) || 0;
  }

  // Clear store
  clear() {
    this.users.clear();
    this.currentProfile = null;
    this.following = [];
    this.followers = [];
    this.followStatus.clear();
    this.followerCounts.clear();
    this.followingCounts.clear();
    this.loading = false;
    this.error = null;
  }
}

export default UserStore;
