const BaseRepository = require('./BaseRepository');

class CommentRepository extends BaseRepository {
  constructor() {
    super('comments');
  }

  // Get comments for a post with user info
  async getByPostId(postId, limit = 50, offset = 0) {
    try {
      const limitNum = parseInt(limit) || 50;
      const offsetNum = parseInt(offset) || 0;
      
      const [rows] = await this.db.execute(`
        SELECT 
          c.id, c.content, c.created_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified
        FROM comments c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at ASC
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `, [postId]);
      
      return rows;
    } catch (error) {
      throw new Error(`Error getting comments: ${error.message}`);
    }
  }

  // Create comment
  async create(postId, userId, content) {
    try {
      const [result] = await this.db.execute(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [postId, userId, content]
      );
      
      return await this.findById(result.insertId);
    } catch (error) {
      throw new Error(`Error creating comment: ${error.message}`);
    }
  }

  // Delete comment
  async delete(commentId, userId) {
    try {
      // Check if comment exists and belongs to user
      const comment = await this.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
      
      if (comment.user_id !== userId) {
        throw new Error('Unauthorized to delete this comment');
      }
      
      await this.db.execute('DELETE FROM comments WHERE id = ?', [commentId]);
      return { success: true };
    } catch (error) {
      throw new Error(`Error deleting comment: ${error.message}`);
    }
  }

  // Get comment with user info
  async findByIdWithUser(commentId) {
    try {
      const [rows] = await this.db.execute(`
        SELECT 
          c.id, c.content, c.created_at, c.post_id,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified
        FROM comments c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `, [commentId]);
      
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error getting comment: ${error.message}`);
    }
  }
}

module.exports = CommentRepository;
