const BaseRepository = require('./BaseRepository');

class FollowRepository extends BaseRepository {
  constructor() {
    super('follows');
  }

  // Check if user is following another user
  async isFollowing(followerId, followingId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking follow status: ${error.message}`);
    }
  }

  // Follow a user
  async followUser(followerId, followingId) {
    try {
      // Check if already following
      const isFollowing = await this.isFollowing(followerId, followingId);
      if (isFollowing) {
        throw new Error('Already following this user');
      }

      // Check if trying to follow self
      if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
      }

      // Create follow relationship
      const follow = await this.create({
        follower_id: followerId,
        following_id: followingId
      });

      return follow;
    } catch (error) {
      throw new Error(`Error following user: ${error.message}`);
    }
  }

  // Unfollow a user
  async unfollowUser(followerId, followingId) {
    try {
      const [result] = await this.db.execute(
        'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
        [followerId, followingId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Follow relationship not found');
      }

      return true;
    } catch (error) {
      throw new Error(`Error unfollowing user: ${error.message}`);
    }
  }

  // Get mutual follows (users who follow each other)
  async getMutualFollows(userId, limit = 50, offset = 0) {
    try {
      const [rows] = await this.db.execute(`
        SELECT 
          u.id, u.username, u.full_name, u.avatar, u.is_verified
        FROM users u
        WHERE u.id IN (
          SELECT f1.following_id 
          FROM follows f1
          INNER JOIN follows f2 ON f1.following_id = f2.follower_id 
                                AND f1.follower_id = f2.following_id
          WHERE f1.follower_id = ?
        )
        LIMIT ? OFFSET ?
      `, [userId, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting mutual follows: ${error.message}`);
    }
  }

  // Get follow suggestions (users not followed by current user)
  async getFollowSuggestions(userId, limit = 10, offset = 0) {
    try {
      const [rows] = await this.db.execute(`
        SELECT 
          u.id, u.username, u.full_name, u.avatar, u.is_verified, u.followers_count
        FROM users u
        WHERE u.id != ? 
          AND u.id NOT IN (
            SELECT following_id FROM follows WHERE follower_id = ?
          )
        ORDER BY u.followers_count DESC
        LIMIT ? OFFSET ?
      `, [userId, userId, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting follow suggestions: ${error.message}`);
    }
  }

  // Get follower count for a user
  async getFollowerCount(userId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT COUNT(*) as count FROM follows WHERE following_id = ?',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error getting follower count: ${error.message}`);
    }
  }

  // Get following count for a user
  async getFollowingCount(userId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT COUNT(*) as count FROM follows WHERE follower_id = ?',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error getting following count: ${error.message}`);
    }
  }
}

module.exports = FollowRepository;