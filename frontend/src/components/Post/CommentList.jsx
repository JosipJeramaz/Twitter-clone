import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useCommentStore, useAuthStore } from '../../hooks/useStores';
import './CommentList.css';

const CommentList = observer(({ postId }) => {
  const commentStore = useCommentStore();
  const authStore = useAuthStore();
  const comments = commentStore.getComments(postId);

  useEffect(() => {
    // Load comments when component mounts
    commentStore.fetchComments(postId);
  }, [postId, commentStore]);

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await commentStore.deleteComment(postId, commentId);
      // CommentStore automatically updates PostStore.comments_count
      // MobX will auto-update all observers
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (commentStore.loading && comments.length === 0) {
    return (
      <div className="comment-list">
        <div className="comment-list-loading">Loading comments...</div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="comment-list">
        <div className="comment-list-empty">No comments yet. Be the first to comment!</div>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <div className="comment-content">
            <div className="comment-header">
              <div className="comment-user-info">
                <span className="comment-username">{comment.full_name || comment.username}</span>
                {comment.is_verified === 1 && (
                  <span className="comment-verified">✓</span>
                )}
                <span className="comment-handle">@{comment.username}</span>
                <span className="comment-separator">·</span>
                <span className="comment-date">{formatDate(comment.created_at)}</span>
              </div>
              {authStore.user?.id === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="comment-delete-btn"
                  title="Delete comment"
                >
                  🗑️
                </button>
              )}
            </div>
            <p className="comment-text">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default CommentList;
