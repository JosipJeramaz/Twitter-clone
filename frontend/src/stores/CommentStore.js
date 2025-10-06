// CommentStore.js - Komentari
import { makeAutoObservable, runInAction } from 'mobx';
import { commentService } from '../services/api';

class CommentStore {
  // Map: postId -> array of comments
  commentsByPost = new Map();
  loading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Get comments for a specific post
  getComments(postId) {
    return this.commentsByPost.get(postId) || [];
  }

  // Fetch comments from API
  async fetchComments(postId) {
    this.loading = true;
    this.error = null;

    try {
      const response = await commentService.getComments(postId);
      
      runInAction(() => {
        this.commentsByPost.set(postId, response.data.comments);
        this.loading = false;
      });

      return response.data.comments;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to fetch comments';
        this.loading = false;
      });
      throw error;
    }
  }

  // Add comment
  async addComment(postId, content) {
    this.error = null;

    try {
      const response = await commentService.addComment(postId, content);
      const newComment = response.data.comment;

      runInAction(() => {
        const comments = this.commentsByPost.get(postId) || [];
        // Add new comment at the end (oldest first order)
        this.commentsByPost.set(postId, [...comments, newComment]);
        
        // Update comments_count in PostStore
        this.rootStore.postStore.updatePostCommentCount(postId, 1);
      });

      return newComment;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to add comment';
      });
      throw error;
    }
  }

  // Delete comment
  async deleteComment(postId, commentId) {
    this.error = null;

    try {
      await commentService.deleteComment(postId, commentId);

      runInAction(() => {
        const comments = this.commentsByPost.get(postId) || [];
        const updatedComments = comments.filter(c => c.id !== commentId);
        this.commentsByPost.set(postId, updatedComments);
        
        // Update comments_count in PostStore
        this.rootStore.postStore.updatePostCommentCount(postId, -1);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || 'Failed to delete comment';
      });
      throw error;
    }
  }

  // Clear comments for a specific post
  clearComments(postId) {
    this.commentsByPost.delete(postId);
  }

  // Clear all comments
  clearAll() {
    this.commentsByPost.clear();
    this.error = null;
  }
}

export default CommentStore;

