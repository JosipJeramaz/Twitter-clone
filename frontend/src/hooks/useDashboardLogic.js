import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { postService } from '../services/api';

/**
 * Custom hook for managing Dashboard logic
 */
export const useDashboardLogic = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  /**
   * Load posts from timeline
   */
  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
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
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const newPostData = await postService.createPost(newPost.trim());
      
      // Add new post to the top of the list
      setPosts(prevPosts => [newPostData.post, ...prevPosts]);
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
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
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
    posts,
    newPost,
    loading,
    posting,
    user,
    
    // Actions
    handlePostChange,
    handleCreatePost,
    handleDeletePost,
    refreshTimeline,
    
    // Utilities
    loadPosts
  };
};