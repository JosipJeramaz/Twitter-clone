import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';

export const DashboardTemplate = ({
  user,
  loading,
  posts,
  newPost,
  posting,
  onPostChange,
  onCreatePost,
  onDeletePost
}) => {
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
        <h1>Welcome back, {user?.full_name || user?.username}!</h1>
        <Link to={`/profile/${user?.username}`} className="profile-link">
          View My Profile
        </Link>
      </div>

      {/* Create Post Form */}
      <div className="create-post">
        <form onSubmit={onCreatePost}>
          <textarea
            value={newPost}
            onChange={onPostChange}
            placeholder="What's happening?"
            className="post-textarea"
            maxLength={280}
          />
          <div className="post-actions">
            <span className="char-count">{newPost.length}/280</span>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={!newPost.trim() || posting}
              loading={posting}
            >
              {posting ? 'Posting...' : 'Tweet'}
            </Button>
          </div>
        </form>
      </div>

      {/* Posts Timeline */}
      <div className="posts-timeline">
        <h2>Timeline</h2>
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Start following people or create your first post!</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <div className="post-author">
                    <Link to={`/profile/${post.username}`} className="author-link">
                      <div className="post-avatar">
                        {post.user_avatar ? (
                          <img src={post.user_avatar} alt={post.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {post.username?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div className="author-info">
                        <span className="author-name">{post.full_name || post.username}</span>
                        <span className="author-username">@{post.username}</span>
                      </div>
                    </Link>
                  </div>
                  <span className="post-date">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="post-content">
                  {post.content}
                </div>

                <div className="post-actions">
                  <span className="action-item">
                    <span className="icon">💬</span>
                    {post.comments_count || 0}
                  </span>
                  <span className="action-item">
                    <span className="icon">❤️</span>
                    {post.likes_count || 0}
                  </span>
                  {post.user_id === user?.id && (
                    <button 
                      onClick={() => onDeletePost(post.id)}
                      className="delete-post-btn"
                      title="Delete post"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};