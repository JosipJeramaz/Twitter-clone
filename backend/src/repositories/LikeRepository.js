const BaseRepository = require('./BaseRepository');

class LikeRepository extends BaseRepository {
  constructor() {
    super('likes');
  }

  // Check if user liked a post
  async isPostLikedByUser(postId, userId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking like status: ${error.message}`);
    }
  }

  // Like a post
  async likePost(postId, userId) {
    try {
      // Check if already liked
      const isLiked = await this.isPostLikedByUser(postId, userId);
      if (isLiked) {
        throw new Error('Post already liked by user');
      }

      // Create like
      const like = await this.create({
        post_id: postId,
        user_id: userId
      });

      return like;
    } catch (error) {
      throw new Error(`Error liking post: ${error.message}`);
    }
  }

  // Unlike a post
  async unlikePost(postId, userId) {
    try {
      const [result] = await this.db.execute(
        'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Like not found');
      }

      return true;
    } catch (error) {
      throw new Error(`Error unliking post: ${error.message}`);
    }
  }

  // Get users who liked a post
  async getPostLikes(postId, limit = 50, offset = 0) {
    try {
      const [rows] = await this.db.execute(`
        SELECT 
          u.id, u.username, u.full_name, u.avatar, u.is_verified,
          l.created_at as liked_at
        FROM likes l
        INNER JOIN users u ON l.user_id = u.id
        WHERE l.post_id = ?
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `, [postId, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting post likes: ${error.message}`);
    }
  }

  // Get user's liked posts
  async getUserLikedPosts(userId, limit = 20, offset = 0) {
    try {
      const [rows] = await this.db.execute(`
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified,
          l.created_at as liked_at
        FROM likes l
        INNER JOIN posts p ON l.post_id = p.id
        INNER JOIN users u ON p.user_id = u.id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting user liked posts: ${error.message}`);
    }
  }

  // Get like count for a post
  async getPostLikeCount(postId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT COUNT(*) as count FROM likes WHERE post_id = ?',
        [postId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error getting like count: ${error.message}`);
    }
  }
}

module.exports = LikeRepository;