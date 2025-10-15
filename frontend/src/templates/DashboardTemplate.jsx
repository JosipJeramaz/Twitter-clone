import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useLikeStore, usePostStore } from '../hooks/useStores';
import Button from '../components/UI/Button.jsx';
import CommentList from '../components/Post/CommentList.jsx';
import CommentForm from '../components/Post/CommentForm.jsx';
import FeedFilter from '../components/Post/FeedFilter.jsx';

export const DashboardTemplate = observer(({
  user,
  loading,
  newPost,
  posting,
  feedFilter,
  onPostChange,
  onCreatePost,
  onDeletePost,
  onLikePost,
  onFilterChange
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
  
  // Debug logging
  console.log('🔍 DashboardTemplate Debug:');
  console.log('  - user:', user);
  console.log('  - loading:', loading);
  console.log('  - posts:', posts);
  console.log('  - feedFilter:', feedFilter);
  if (loading || !user) {
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
        <h1>Welcome back, {user?.full_name || user?.username || 'User'}!</h1>
        {user?.username && (
          <Link to={`/profile/${user.username}`} className="profile-link">
            View My Profile
          </Link>
        )}
      </div>

      {/* Create Post Form */}
      <div className="create-post">
        <form onSubmit={onCreatePost}>
          <textarea
            value={newPost}
            onChange={onPostChange}
            placeholder={user ? "What's happening?" : "Loading..."}
            className="post-textarea"
            maxLength={280}
            disabled={!user}
          />
          <div className="post-actions">
            <span className="char-count">{newPost.length}/280</span>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={!user || !newPost.trim() || posting}
              loading={posting}
            >
              {posting ? 'Posting...' : 'Tweet'}
            </Button>
          </div>
        </form>
      </div>

      {/* Feed Filter */}
      <FeedFilter 
        activeFilter={feedFilter} 
        onFilterChange={onFilterChange} 
      />

      {/* Posts Timeline */}
      <div className="posts-timeline">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>
              {feedFilter === 'following' 
                ? "No posts from people you follow. Start following more people!" 
                : "No posts yet. Create your first post!"}
            </p>
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

                {/* Comments Section */}
                {openComments[post.id] && (
                  <div className="post-comments-section">
                    <CommentList postId={post.id} />
                    <CommentForm postId={post.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});