class CommentService {
  constructor(commentRepository, postRepository) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
  }

  // Get comments for a post
  async getPostComments(postId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;
      const comments = await this.commentRepository.getByPostId(postId, limit, offset);
      
      return {
        comments,
        pagination: {
          page,
          limit,
          total: comments.length
        }
      };
    } catch (error) {
      throw new Error(`Failed to get comments: ${error.message}`);
    }
  }

  // Create comment
  async createComment(postId, userId, content) {
    try {
      // Validate content
      if (!content || content.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }

      // Check if post exists
      const post = await this.postRepository.findById(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      // Create comment
      const comment = await this.commentRepository.create(postId, userId, content.trim());

      // Update post comments count
      await this.postRepository.updateCounters(postId);

      // Get comment with user info
      const commentWithUser = await this.commentRepository.findByIdWithUser(comment.id);

      return commentWithUser;
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  // Delete comment
  async deleteComment(commentId, userId) {
    try {
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }

      // Delete comment
      await this.commentRepository.delete(commentId, userId);

      // Update post comments count
      await this.postRepository.updateCounters(comment.post_id);

      return { message: 'Comment deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }
}

module.exports = CommentService;
