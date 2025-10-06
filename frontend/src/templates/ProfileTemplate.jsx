import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useLikeStore, usePostStore } from '../hooks/useStores';
import CommentList from '../components/Post/CommentList.jsx';
import CommentForm from '../components/Post/CommentForm.jsx';

export const ProfileTemplate = observer(({
  loading,
  error,
  profile,
  username,
  isOwnProfile,
  onDeletePost,
  onLikePost
}) => {
  const likeStore = useLikeStore();
  const postStore = usePostStore(); // Get postStore directly in template
  const [openComments, setOpenComments] = useState({});
  
  const posts = postStore.posts; // Use observable directly

  const toggleComments = (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-error">
        <h2>Profile not found</h2>
        <p>The user @{username} does not exist.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-banner"></div>
        
        <div className="profile-info">
          <div className="avatar-section">
            <div className="avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.username?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            
            {isOwnProfile && (
              <Link to="/profile/edit" className="edit-profile-btn">
                Edit Profile
              </Link>
            )}
          </div>

          <div className="profile-details">
            <h1 className="profile-name">{profile.full_name || profile.username}</h1>
            <p className="profile-username">@{profile.username}</p>
            
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            
            <div className="profile-meta">
              {profile.location && (
                <span className="meta-item">
                  📍 {profile.location}
                </span>
              )}
              {profile.website && (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="meta-item website-link"
                >
                  🔗 {profile.website}
                </a>
              )}
              <span className="meta-item">
                📅 Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="profile-stats">
              <span className="stat-item">
                <strong>{profile.following_count || 0}</strong> Following
              </span>
              <span className="stat-item">
                <strong>{profile.followers_count || 0}</strong> Followers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="profile-tabs">
        <div className="tab active">Posts ({profile.posts_count || 0})</div>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet.</p>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div className="post-author">
                  <Link to={`/profile/${post.username}`} className="author-link">
                    <div className="post-avatar">
                      <div className="avatar-placeholder">
                        {post.username?.charAt(0)?.toUpperCase() || '?'}
                      </div>
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
                <div className="actions-left">
                  <button 
                    className={`action-item comment-btn ${openComments[post.id] ? 'active' : ''}`}
                    onClick={() => toggleComments(post.id)}
                    title="Comments"
                  >
                    <span className="icon">💬</span>
                    {post.comments_count || 0}
                  </button>
                  <button 
                    className={`action-item like-btn ${likeStore.isLiked(post.id) ? 'liked' : ''}`}
                    onClick={() => onLikePost(post.id)}
                    title={likeStore.isLiked(post.id) ? 'Unlike post' : 'Like post'}
                  >
                    <span className="icon">{likeStore.isLiked(post.id) ? '❤️' : '🤍'}</span>
                    {likeStore.getLikesCount(post.id)}
                  </button>
                </div>
                {isOwnProfile && (
                  <button 
                    onClick={() => onDeletePost(post.id)}
                    className="delete-post-btn"
                    title="Delete post"
                  >
                    🗑️
                  </button>
                )}
              </div>

              {/* Comments Section */}
              {openComments[post.id] && (
                <div className="post-comments-section">
                  <CommentList postId={post.id} />
                  <CommentForm postId={post.id} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
});
