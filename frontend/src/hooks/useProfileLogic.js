import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore, usePostStore, useLikeStore } from './useStores';
import { userService, postService } from '../services/api';

/**
 * Custom hook for managing Profile page logic
 */
export const useProfileLogic = () => {
  const { username } = useParams();
  const authStore = useAuthStore();
  const postStore = usePostStore();
  const likeStore = useLikeStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Debug logs
  console.log('🔍 useProfileLogic Debug:');
  console.log('  - URL username:', username);
  console.log('  - Current user:', authStore.user);
  console.log('  - Current user username:', authStore.user?.username);

  // Fetch profile when username changes
  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Fetch posts when profile is loaded
  useEffect(() => {
    if (profile) {
      fetchUserPosts();
    }
  }, [profile]);

  // Check if it's own profile
  useEffect(() => {
    setIsOwnProfile(authStore.user?.username === username);
  }, [authStore.user, username]);

  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🌐 API call for username:', username);
      console.log('🌐 API URL:', `/users/username/${username}`);
      const response = await userService.getProfile(username);
      console.log('✅ Profile API response:', response); // Debug log
      setProfile(response.data.user);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      setError('User not found');
      setProfile(null);
      setLoading(false); // Important: set loading to false even in case of error
    }
  };

  /**
   * Fetch user posts
   */
  const fetchUserPosts = async () => {
    try {
      if (profile && profile.id) {
        console.log('🔍 Fetching posts for user ID:', profile.id);
        const data = await postService.getUserPosts(profile.id);
        console.log('✅ Posts response:', data);
        
        const fetchedPosts = data.data.posts || [];
        
        // Update PostStore (MobX will auto-update observers)
        postStore.setPosts(fetchedPosts);
        
        // Sync likes to LikeStore
        likeStore.syncLikesFromPosts(fetchedPosts);
      }
    } catch (error) {
      console.error('❌ Error fetching user posts:', error);
    } finally {
      setLoading(false);
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
    try {
      // Get current like status from LikeStore
      const wasLiked = likeStore.isLiked(postId);
      const currentLikesCount = likeStore.getLikesCount(postId);

      // Optimistically update LikeStore
      const newIsLiked = likeStore.toggleLike(postId);
      const newLikesCount = likeStore.getLikesCount(postId);

      // Update PostStore (MobX will auto-update observers)
      postStore.updatePostLike(postId, newIsLiked, newLikesCount);

      // Make API call
      if (wasLiked) {
        await postService.unlikePost(postId);
        console.log(`✅ Successfully unliked post ${postId}`);
      } else {
        await postService.likePost(postId);
        console.log(`✅ Successfully liked post ${postId}`);
      }
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Revert optimistic update on error
      likeStore.setPostLikeData(postId, wasLiked, currentLikesCount);
      postStore.updatePostLike(postId, wasLiked, currentLikesCount);
      
      // Show more specific error message
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to update like: ${errorMessage}`);
    }
  };

  /**
   * Refresh profile data
   */
  const refreshProfile = () => {
    if (username) {
      fetchProfile();
    }
  };

  /**
   * Refresh posts
   */
  const refreshPosts = () => {
    if (profile) {
      fetchUserPosts();
    }
  };

  return {
    // State
    profile,
    posts: postStore.posts, // Use MobX observable directly
    loading,
    error,
    username,
    isOwnProfile,
    currentUser: authStore.user,
    
    // Actions
    handleDeletePost,
    handleLikePost,
    refreshProfile,
    refreshPosts,
    
    // Utilities
    fetchProfile,
    fetchUserPosts
  };
};