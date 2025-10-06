// PostStore.js - CRUD za postove
import { makeAutoObservable } from 'mobx';

class PostStore {
  posts = [];
  currentPost = null;
  loading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  // Set all posts (used when loading timeline/profile)
  setPosts(posts) {
    this.posts = posts;
  }

  // Add new post
  addPost(post) {
    this.posts = [post, ...this.posts];
  }

  // Remove post
  removePost(postId) {
    this.posts = this.posts.filter(post => post.id !== postId);
  }

  // Update post
  updatePost(updatedPost) {
    this.posts = this.posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
  }

  // Update post like status globally
  updatePostLike(postId, isLiked, likesCount) {
    this.posts = this.posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            is_liked: isLiked,
            likes_count: likesCount
          }
        : post
    );
  }

  // Update post comments count
  updatePostCommentCount(postId, delta) {
    this.posts = this.posts.map(post => 
      post.id === postId 
        ? {
            ...post,
            comments_count: Math.max(0, (post.comments_count || 0) + delta)
          }
        : post
    );
  }

  // Get post by ID
  getPost(postId) {
    return this.posts.find(post => post.id === postId);
  }

  // Set current post (for detail view)
  setCurrentPost(post) {
    this.currentPost = post;
  }

  // Clear current post
  clearCurrentPost() {
    this.currentPost = null;
  }
}

export default PostStore;
