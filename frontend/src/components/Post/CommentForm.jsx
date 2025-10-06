import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useCommentStore, useAuthStore } from '../../hooks/useStores';
import './CommentForm.css';

const CommentForm = observer(({ postId }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const commentStore = useCommentStore();
  const authStore = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await commentStore.addComment(postId, content.trim());
      setContent(''); // Clear input on success
      // CommentStore automatically updates PostStore.comments_count
      // MobX will auto-update all observers
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authStore.isAuthenticated) {
    return null; // Don't show form if not logged in
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form-content">
        <input
          type="text"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="comment-form-input"
          maxLength={280}
        />
      </div>
      <button 
        type="submit" 
        disabled={!content.trim() || isSubmitting}
        className="comment-form-button"
      >
        {isSubmitting ? 'Posting...' : 'Comment'}
      </button>
    </form>
  );
});

export default CommentForm;
