import React from 'react';
import { Link } from 'react-router-dom';

export const ProfileTemplate = ({
  loading,
  error,
  profile,
  posts,
  username,
  isOwnProfile,
  onDeletePost
}) => {
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
        <h2>User not found</h2>
        <p>The profile you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-banner">
          {/* Future: Banner image */}
        </div>
        
        <div className="profile-info">
          <div className="avatar-section">
            <div className="avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.full_name || profile.username} />
              ) : (
                <div className="avatar-placeholder">
                  {(profile.full_name?.charAt(0) || profile.username.charAt(0)).toUpperCase()}
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
            <h1 className="display-name">{profile.full_name || profile.username}</h1>
            <p className="username">@{profile.username}</p>
            
            {profile.bio && (
              <p className="bio">{profile.bio}</p>
            )}
            
            <div className="profile-meta">
              {profile.location && (
                <span className="location">
                  <span className="icon">📍</span>
                  {profile.location}
                </span>
              )}
              {profile.website && (
                <span className="website">
                  <span className="icon">🔗</span>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </span>
              )}
              <span className="joined">
                <span className="icon">📅</span>
                Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="profile-stats">
              <span className="stat">
                <strong>{profile.following_count || 0}</strong> Following
              </span>
              <span className="stat">
                <strong>{profile.followers_count || 0}</strong> Followers
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <div className="tab active">
            Posts <span className="count">({posts.length})</span>
          </div>
        </div>

        <div className="profile-posts">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>{isOwnProfile ? "You haven't posted anything yet." : `@${username} hasn't posted anything yet.`}</p>
              {isOwnProfile && (
                <Link to="/dashboard" className="create-post-link">Create your first post</Link>
              )}
            </div>
          ) : (
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt={profile.username} />
                        ) : (
                          <div className="avatar-placeholder small">
                            {profile.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="author-info">
                        <span className="author-name">{profile.full_name || profile.username}</span>
                        <span className="author-username">@{profile.username}</span>
                      </div>
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
                  </div>
                  
                  {isOwnProfile && (
                    <div className="post-manage">
                      <button 
                        onClick={() => onDeletePost(post.id)}
                        className="delete-btn"
                        title="Delete post"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};