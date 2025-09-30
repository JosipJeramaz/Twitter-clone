import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService, postService } from '../services/api';

/**
 * Custom hook for managing Profile page logic
 */
export const useProfileLogic = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Debug logs
  console.log('🔍 useProfileLogic Debug:');
  console.log('  - URL username:', username);
  console.log('  - Current user:', currentUser);
  console.log('  - Current user username:', currentUser?.username);

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
    setIsOwnProfile(currentUser?.username === username);
  }, [currentUser, username]);

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
        const data = await postService.getUserPosts(profile.id);
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setPosts([]);
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
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
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
    posts,
    loading,
    error,
    username,
    isOwnProfile,
    currentUser,
    
    // Actions
    handleDeletePost,
    refreshProfile,
    refreshPosts,
    
    // Utilities
    fetchProfile,
    fetchUserPosts
  };
};