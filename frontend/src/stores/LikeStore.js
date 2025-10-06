// LikeStore.js - Lajkovi
import { makeAutoObservable, runInAction } from 'mobx';

class LikeStore {
  likes = new Map(); // postId -> number of likes
  userLikes = new Set(); // Set of post IDs that user has liked
  loading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  /**
   * Check if user has liked a specific post
   */
  isLiked(postId) {
    return this.userLikes.has(postId);
  }

  /**
   * Get likes count for a specific post
   */
  getLikesCount(postId) {
    return this.likes.get(postId) || 0;
  }

  /**
   * Set like data for a post
   */
  setPostLikeData(postId, isLiked, likesCount) {
    this.likes.set(postId, likesCount);
    if (isLiked) {
      this.userLikes.add(postId);
    } else {
      this.userLikes.delete(postId);
    }
  }

  /**
   * Toggle like status for a post
   */
  toggleLike(postId) {
    const currentLikes = this.getLikesCount(postId);
    const isCurrentlyLiked = this.isLiked(postId);

    if (isCurrentlyLiked) {
      // Unlike
      this.likes.set(postId, Math.max(currentLikes - 1, 0));
      this.userLikes.delete(postId);
    } else {
      // Like
      this.likes.set(postId, currentLikes + 1);
      this.userLikes.add(postId);
    }

    return !isCurrentlyLiked; // Return new like status
  }

  /**
   * Like a post
   */
  likePost(postId) {
    if (!this.isLiked(postId)) {
      const currentLikes = this.getLikesCount(postId);
      this.likes.set(postId, currentLikes + 1);
      this.userLikes.add(postId);
    }
  }

  /**
   * Unlike a post
   */
  unlikePost(postId) {
    if (this.isLiked(postId)) {
      const currentLikes = this.getLikesCount(postId);
      this.likes.set(postId, Math.max(currentLikes - 1, 0));
      this.userLikes.delete(postId);
    }
  }

  /**
   * Sync likes from posts array (when loading posts)
   */
  syncLikesFromPosts(posts) {
    posts.forEach(post => {
      if (post.id) {
        // Update likes count
        this.likes.set(post.id, post.likes_count || 0);
        
        // Update user like status - VAŽNO: briši ako nije liked!
        if (post.is_liked) {
          this.userLikes.add(post.id);
        } else {
          this.userLikes.delete(post.id); // BITNO: briši ako nije liked
        }
      }
    });
  }

  /**
   * Clear all like data
   */
  clearLikes() {
    this.likes.clear();
    this.userLikes.clear();
    this.error = null;
  }

  /**
   * Set error
   */
  setError(error) {
    this.error = error;
  }

  /**
   * Clear error
   */
  clearError() {
    this.error = null;
  }
}

export default LikeStore;
