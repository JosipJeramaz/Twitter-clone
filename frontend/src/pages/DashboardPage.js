import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postService } from '../services/api';
import Button from '../components/UI/Button';
import './DashboardPage.css';

const DashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const post = await postService.createPost(newPost);
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your timeline...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Home</h1>
      </div>

      {/* Create Post Form */}
      <div className="create-post">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's happening?"
            className="post-textarea"
            maxLength={280}
          />
          <div className="post-actions">
            <span className="char-count">
              {280 - newPost.length}
            </span>
            <Button 
              type="submit" 
              variant="primary" 
              loading={posting}
              disabled={!newPost.trim()}
            >
              Tweet
            </Button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="post-user">
                  <strong>{post.user?.full_name || post.user?.username}</strong>
                  <span className="post-username">@{post.user?.username}</span>
                  <span className="post-time">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                {user && user.id === post.user_id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="delete-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="post-content">
                {post.content}
              </div>
              <div className="post-footer">
                <span className="post-stats">
                  {post.likes_count || 0} likes • {post.comments_count || 0} comments
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;