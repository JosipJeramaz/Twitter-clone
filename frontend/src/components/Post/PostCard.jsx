// PostCard.jsx - Komponenta sa integriranim LikeStore i CommentStore
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLikeStore, useCommentStore } from '../../hooks/useStores';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import './PostCard.css';

/**
 * PostCard komponenta sa like i comment funkcionalnostima
 * 
 * observer() wrapper omogućava automatsko re-renderovanje
 * kada se observable podaci u MobX stores promijene
 */
const PostCard = observer(({ post, onLike, onDelete, currentUser }) => {
  const likeStore = useLikeStore();
  const commentStore = useCommentStore();
  const [showComments, setShowComments] = useState(false);

  // Dohvati like status iz LikeStore
  const isLiked = likeStore.isLiked(post.id);
  const likesCount = likeStore.getLikesCount(post.id);

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <strong>{post.author?.username || post.username || 'Unknown'}</strong>
        <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-actions">
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? '❤️' : '🤍'} {likesCount}
        </button>

        <button 
          className={`comment-button ${showComments ? 'active' : ''}`}
          onClick={toggleComments}
          title="Comments"
        >
          💬 {post.comments_count || 0}
        </button>

        {currentUser?.id === post.user_id && onDelete && (
          <button 
            className="delete-button"
            onClick={() => onDelete(post.id)}
            title="Delete post"
          >
            🗑️
          </button>
        )}
      </div>

      {showComments && (
        <div className="post-comments-section">
          <CommentList postId={post.id} />
          <CommentForm postId={post.id} />
        </div>
      )}
    </div>
  );
});

export default PostCard;
