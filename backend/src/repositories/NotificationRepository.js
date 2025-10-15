const BaseRepository = require('./BaseRepository');

class NotificationRepository extends BaseRepository {
  constructor() {
    super('notifications');
  }

  /**
   * Create a new notification
   */
  async createNotification(userId, fromUserId, type, postId = null) {
    try {
      // Don't create notification if user is notifying themselves
      if (userId === fromUserId) {
        return null;
      }

      const [result] = await this.db.execute(
        `INSERT INTO notifications (user_id, from_user_id, type, post_id) 
         VALUES (?, ?, ?, ?)`,
        [userId, fromUserId, type, postId]
      );

      return await this.findByIdWithUser(result.insertId);
    } catch (error) {
      throw new Error(`Error creating notification: ${error.message}`);
    }
  }

  /**
   * Get notifications for a user with user details
   */
  async getUserNotifications(userId, limit = 20, offset = 0) {
    try {
      // Ensure limit and offset are integers
      const safeLimit = parseInt(limit, 10);
      const safeOffset = parseInt(offset, 10);
      
      const [rows] = await this.db.execute(
        `SELECT 
          n.id, n.type, n.post_id, n.is_read, n.created_at,
          u.id as from_user_id, u.username as from_username, 
          u.full_name as from_full_name, u.avatar as from_avatar,
          u.is_verified as from_is_verified,
          p.content as post_content
        FROM notifications n
        INNER JOIN users u ON n.from_user_id = u.id
        LEFT JOIN posts p ON n.post_id = p.id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}`,
        [userId]
      );

      return rows;
    } catch (error) {
      throw new Error(`Error getting notifications: ${error.message}`);
    }
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId) {
    try {
      const [rows] = await this.db.execute(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
        [userId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error getting unread count: ${error.message}`);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const [result] = await this.db.execute(
        'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Notification not found or unauthorized');
      }

      return true;
    } catch (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    try {
      await this.db.execute(
        'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
        [userId]
      );
      return true;
    } catch (error) {
      throw new Error(`Error marking all as read: ${error.message}`);
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      const [result] = await this.db.execute(
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Notification not found or unauthorized');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting notification: ${error.message}`);
    }
  }

  /**
   * Find notification by ID with user details
   */
  async findByIdWithUser(notificationId) {
    try {
      const [rows] = await this.db.execute(
        `SELECT 
          n.id, n.user_id, n.type, n.post_id, n.is_read, n.created_at,
          u.id as from_user_id, u.username as from_username, 
          u.full_name as from_full_name, u.avatar as from_avatar,
          u.is_verified as from_is_verified
        FROM notifications n
        INNER JOIN users u ON n.from_user_id = u.id
        WHERE n.id = ?`,
        [notificationId]
      );

      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding notification: ${error.message}`);
    }
  }

  /**
   * Check if notification already exists (to prevent duplicates)
   * For comments, we don't check duplicates (allow multiple notifications)
   * For likes and follows, we prevent duplicates within 1 hour
   */
  async notificationExists(userId, fromUserId, type, postId = null) {
    try {
      // For comments, always allow new notifications (don't check for duplicates)
      if (type === 'comment') {
        return false;
      }

      // For likes, follows, and other types, check for recent duplicates
      const query = postId
        ? 'SELECT id FROM notifications WHERE user_id = ? AND from_user_id = ? AND type = ? AND post_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)'
        : 'SELECT id FROM notifications WHERE user_id = ? AND from_user_id = ? AND type = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)';
      
      const params = postId ? [userId, fromUserId, type, postId] : [userId, fromUserId, type];
      
      const [rows] = await this.db.execute(query, params);
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error checking notification existence: ${error.message}`);
    }
  }

  /**
   * Delete notification by type and post (used when unliking or unfollow)
   */
  async deleteByTypeAndPost(userId, fromUserId, type, postId = null) {
    try {
      const query = postId
        ? 'DELETE FROM notifications WHERE user_id = ? AND from_user_id = ? AND type = ? AND post_id = ?'
        : 'DELETE FROM notifications WHERE user_id = ? AND from_user_id = ? AND type = ?';
      
      const params = postId ? [userId, fromUserId, type, postId] : [userId, fromUserId, type];
      
      await this.db.execute(query, params);
      return true;
    } catch (error) {
      throw new Error(`Error deleting notification: ${error.message}`);
    }
  }
}

module.exports = NotificationRepository;
