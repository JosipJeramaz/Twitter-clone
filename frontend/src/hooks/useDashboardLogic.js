import { useState, useEffect } from 'react';
import { useAuthStore, usePostStore, useLikeStore } from './useStores';
import { postService } from '../services/api';

/**
 * Custom hook for managing Dashboard logic
 */
export const useDashboardLogic = () => {
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const authStore = useAuthStore();
  const postStore = usePostStore();
  const likeStore = useLikeStore();

  // Debug logging
  console.log('🔍 useDashboardLogic Debug:');
  console.log('  - user:', authStore.user);
  console.log('  - isAuthenticated:', authStore.isAuthenticated);
  console.log('  - authLoading:', authStore.loading);

  useEffect(() => {
    // Only load posts when user is authenticated and loaded
    if (authStore.user && authStore.isAuthenticated && !authStore.loading) {
      loadPosts();
    }
  }, [authStore.user, authStore.isAuthenticated, authStore.loading]);

  /**
   * Load posts from timeline
   */
  const loadPosts = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading posts...');
      const data = await postService.getAllPosts();
      console.log('✅ Posts loaded:', data);
      const posts = data.data.posts || [];
      
      // Log like status for debugging
      posts.forEach(post => {
        console.log(`📊 Post ${post.id}: is_liked=${post.is_liked}, likes_count=${post.likes_count}`);
      });
      
      // Update global state (MobX will auto-update observers)
      postStore.setPosts(posts);
      // Sync likes to LikeStore
      likeStore.syncLikesFromPosts(posts);
      
      // Verify sync
      console.log('🔄 LikeStore after sync:');
      posts.forEach(post => {
        console.log(`  Post ${post.id}: isLiked=${likeStore.isLiked(post.id)}, count=${likeStore.getLikesCount(post.id)}`);
      });
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle new post text change
   */
  const handlePostChange = (e) => {
    setNewPost(e.target.value);
  };

  /**
   * Create new post
   */
  const handleCreatePost = async (e) => {
    e.preventDefault();
    console.log('Creating post, user state:', authStore.user);
    
    if (!authStore.user) {
      console.log('User not loaded yet, cannot create post');
      alert('Please wait for authentication to complete.');
      return;
    }
    
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      console.log('About to create post with content:', newPost.trim());
      const newPostData = await postService.createPost(newPost.trim());
      console.log('Post created successfully:', newPostData);
      
      // Add new post to PostStore (MobX will auto-update observers)
      postStore.addPost(newPostData.data.post);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  /**
   * Delete post
   */
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(postId);
      postStore.removePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  /**
   * Like/unlike post
   */
  const handleLikePost = async (postId) => {
    // Get current like status BEFORE try block so it's accessible in catch
    const wasLiked = likeStore.isLiked(postId);
    const currentLikesCount = likeStore.getLikesCount(postId);
    
    try {
      // Optimistically update LikeStore
      const newIsLiked = likeStore.toggleLike(postId);
      const newLikesCount = likeStore.getLikesCount(postId);

      // Update PostStore (MobX will auto-update observers)
      postStore.updatePostLike(postId, newIsLiked, newLikesCount);

      // Make API call
      if (wasLiked) {
        await postService.unlikePost(postId);
        console.log(`✅ Unliked post ${postId}`);
      } else {
        await postService.likePost(postId);
        console.log(`✅ Liked post ${postId}`);
      }
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      
      // Revert optimistic update on error
      likeStore.setPostLikeData(postId, wasLiked, currentLikesCount);
      postStore.updatePostLike(postId, wasLiked, currentLikesCount);
      
      alert('Failed to update like. Please try again.');
    }
  };

  /**
   * Refresh timeline
   */
  const refreshTimeline = () => {
    loadPosts();
  };

  return {
    // State
    posts: postStore.posts, // Use MobX observable directly
    newPost,
    loading,
    posting,
    user: authStore.user,
    
    // Actions
    handlePostChange,
    handleCreatePost,
    handleDeletePost,
    handleLikePost,
    refreshTimeline,
    
    // Utilities
    loadPosts
  };
};