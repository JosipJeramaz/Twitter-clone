class CommentController {
  constructor(commentService) {
    this.commentService = commentService;
  }

  // Get comments for a post
  getPostComments = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      const result = await this.commentService.getPostComments(postId, page, limit);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // Create comment
  createComment = async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = req.user.id;
      const { content } = req.body;

      const comment = await this.commentService.createComment(postId, userId, content);

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: { comment }
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete comment
  deleteComment = async (req, res, next) => {
    try {
      const commentId = parseInt(req.params.commentId);
      const userId = req.user.id;

      const result = await this.commentService.deleteComment(commentId, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CommentController;
