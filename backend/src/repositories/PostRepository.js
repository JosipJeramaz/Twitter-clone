const BaseRepository = require('./BaseRepository');

class PostRepository extends BaseRepository {
  constructor() {
    super('posts');
  }

  // Get posts from followed users only
  async getFollowingFeed(userId, limit = 20, offset = 0) {
    try {
      // Ensure parameters are numbers
      const userIdNum = parseInt(userId);
      const limitNum = parseInt(limit) || 20;
      const offsetNum = parseInt(offset) || 0;
      
      console.log('🔍 getFollowingFeed params:', { userId: userIdNum, limit: limitNum, offset: offsetNum });
      
      const [rows] = await this.db.execute(`
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified,
          EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as is_liked
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        INNER JOIN follows f ON p.user_id = f.following_id
        WHERE f.follower_id = ?
        ORDER BY p.created_at DESC
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `, [userIdNum, userIdNum]);
      
      // Convert is_liked from 0/1 to boolean
      const postsWithBoolean = rows.map(post => ({
        ...post,
        is_liked: !!post.is_liked
      }));
      
      console.log('✅ getFollowingFeed results:', postsWithBoolean.length, 'posts');
      return postsWithBoolean;
    } catch (error) {
      console.error('❌ getFollowingFeed error:', error);
      throw new Error(`Error getting following feed: ${error.message}`);
    }
  }

  // Get posts with user info for feed (includes own posts + followed users)
  async getFeedPosts(userId, limit = 20, offset = 0) {
    try {
      // Ensure parameters are numbers
      const userIdNum = parseInt(userId);
      const limitNum = parseInt(limit) || 20;
      const offsetNum = parseInt(offset) || 0;
      
      console.log('🔍 getFeedPosts params:', { userId: userIdNum, limit: limitNum, offset: offsetNum });
      
      const [rows] = await this.db.execute(`
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified,
          EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as is_liked
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        INNER JOIN follows f ON p.user_id = f.following_id
        WHERE f.follower_id = ? OR p.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `, [userIdNum, userIdNum, userIdNum]);
      
      // Convert is_liked from 0/1 to boolean
      const postsWithBoolean = rows.map(post => ({
        ...post,
        is_liked: !!post.is_liked
      }));
      
      console.log('✅ getFeedPosts results:', postsWithBoolean.length, 'posts');
      return postsWithBoolean;
    } catch (error) {
      console.error('❌ getFeedPosts error:', error);
      throw new Error(`Error getting feed posts: ${error.message}`);
    }
  }

  // Get user's posts
  async getUserPosts(userId, limit = 20, offset = 0, currentUserId = null) {
    try {
      // Ensure parameters are numbers
      const userIdNum = parseInt(userId);
      const limitNum = parseInt(limit) || 20;
      const offsetNum = parseInt(offset) || 0;
      
      console.log('🔍 getUserPosts params:', { userId: userIdNum, limit: limitNum, offset: offsetNum, currentUserId });
      
      const query = `
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified
          ${currentUserId ? ', EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as is_liked' : ', 0 as is_liked'}
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const params = currentUserId ? [currentUserId, userIdNum] : [userIdNum];
      const [rows] = await this.db.execute(query, params);
      
      // Convert is_liked from 0/1 to boolean
      const postsWithBoolean = rows.map(post => ({
        ...post,
        is_liked: !!post.is_liked
      }));
      
      console.log('✅ getUserPosts results:', postsWithBoolean.length, 'posts for user', userIdNum);
      return postsWithBoolean;
    } catch (error) {
      console.error('❌ getUserPosts error:', error);
      throw new Error(`Error getting user posts: ${error.message}`);
    }
  }

  // Get post with user info
  async getPostWithUser(postId, currentUserId = null) {
    try {
      const query = `
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified
          ${currentUserId ? ', EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as is_liked' : ''}
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `;
      
      const params = currentUserId ? [currentUserId, postId] : [postId];
      const [rows] = await this.db.execute(query, params);
      
      const post = rows[0] || null;
      if (post && post.is_liked !== undefined) {
        post.is_liked = !!post.is_liked;
      }
      
      return post;
    } catch (error) {
      throw new Error(`Error getting post with user: ${error.message}`);
    }
  }

  // Get public timeline (all posts)
  async getPublicTimeline(limit = 20, offset = 0, currentUserId = null) {
    try {
      // Ensure parameters are numbers
      const limitNum = parseInt(limit) || 20;
      const offsetNum = parseInt(offset) || 0;
      
      console.log('🔍 getPublicTimeline params:', { limit: limitNum, offset: offsetNum, currentUserId });
      
      const query = `
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified
          ${currentUserId ? ', EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ?) as is_liked' : ', 0 as is_liked'}
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limitNum} OFFSET ${offsetNum}
      `;
      
      const params = currentUserId ? [currentUserId] : [];
      const [rows] = await this.db.execute(query, params);
      
      // Convert is_liked from 0/1 to boolean
      const postsWithBoolean = rows.map(post => ({
        ...post,
        is_liked: !!post.is_liked
      }));
      
      console.log('✅ getPublicTimeline results:', postsWithBoolean.length, 'posts');
      return postsWithBoolean;
    } catch (error) {
      console.error('❌ getPublicTimeline error:', error);
      throw new Error(`Error getting public timeline: ${error.message}`);
    }
  }

  // Update post counters
  async updateCounters(postId) {
    try {
      await this.db.execute(`
        UPDATE posts SET 
          likes_count = (SELECT COUNT(*) FROM likes WHERE post_id = ?),
          comments_count = (SELECT COUNT(*) FROM comments WHERE post_id = ?)
        WHERE id = ?
      `, [postId, postId, postId]);
    } catch (error) {
      throw new Error(`Error updating post counters: ${error.message}`);
    }
  }

  // Search posts by content
  async searchPosts(searchTerm, limit = 20, offset = 0) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const [rows] = await this.db.execute(`
        SELECT 
          p.id, p.content, p.image, p.likes_count, p.comments_count, 
          p.retweets_count, p.created_at, p.updated_at,
          u.id as user_id, u.username, u.full_name, u.avatar, u.is_verified
        FROM posts p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.content LIKE ?
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `, [searchPattern, limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error searching posts: ${error.message}`);
    }
  }
}

module.exports = PostRepository;