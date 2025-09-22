const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  // Find user by email
  async findByEmail(email) {
    try {
      const [rows] = await this.db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Find user by username
  async findByUsername(username) {
    try {
      const [rows] = await this.db.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  // Get user's followers
  async getFollowers(userId, limit = 50, offset = 0) {
    try {
      const [rows] = await this.db.execute(`
        SELECT u.id, u.username, u.full_name, u.avatar, u.is_verified
        FROM users u
        INNER JOIN follows f ON u.id = f.follower_id
        WHERE f.following_id = ?
        ORDER BY f.created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting followers: ${error.message}`);
    }
  }

  // Get users that user is following
  async getFollowing(userId, limit = 50, offset = 0) {
    try {
      const [rows] = await this.db.execute(`
        SELECT u.id, u.username, u.full_name, u.avatar, u.is_verified
        FROM users u
        INNER JOIN follows f ON u.id = f.following_id
        WHERE f.follower_id = ?
        ORDER BY f.created_at DESC
        LIMIT ? OFFSET ?
      `, [userId, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting following: ${error.message}`);
    }
  }

  // Update user counters
  async updateCounters(userId) {
    try {
      await this.db.execute(`
        UPDATE users SET 
          followers_count = (SELECT COUNT(*) FROM follows WHERE following_id = ?),
          following_count = (SELECT COUNT(*) FROM follows WHERE follower_id = ?),
          posts_count = (SELECT COUNT(*) FROM posts WHERE user_id = ?)
        WHERE id = ?
      `, [userId, userId, userId, userId]);
    } catch (error) {
      throw new Error(`Error updating user counters: ${error.message}`);
    }
  }

  // Search users by username or full name
  async searchUsers(searchTerm, limit = 20, offset = 0) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [rows] = await this.db.execute(`
        SELECT id, username, full_name, avatar, is_verified, followers_count
        FROM users
        WHERE username LIKE ? OR full_name LIKE ?
        ORDER BY followers_count DESC
        LIMIT ? OFFSET ?
      `, [searchPattern, searchPattern, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error searching users: ${error.message}`);
    }
  }

  // Get user profile with public info only
  async getPublicProfile(userId) {
    try {
      const [rows] = await this.db.execute(`
        SELECT id, username, full_name, bio, avatar, location, website, 
               is_verified, followers_count, following_count, posts_count, created_at
        FROM users
        WHERE id = ?
      `, [userId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error getting user profile: ${error.message}`);
    }
  }
}

module.exports = UserRepository;