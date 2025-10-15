class NotificationService {
  constructor(notificationRepository) {
    if (!notificationRepository) {
      throw new Error('NotificationRepository is required for NotificationService');
    }
    this.notificationRepository = notificationRepository;
  }

  /**
   * Send real-time notification via WebSocket
   */
  _sendRealtimeNotification(userId, notification) {
    try {
      if (global.webSocketService) {
        global.webSocketService.sendNotificationToUser(userId, notification);
        
        // Also update unread count
        this.notificationRepository.getUnreadCount(userId)
          .then(count => {
            global.webSocketService.sendUnreadCountUpdate(userId, count);
          })
          .catch(err => console.error('Error fetching unread count:', err));
      }
    } catch (error) {
      console.error('Error sending real-time notification:', error);
    }
  }

  /**
   * Create a notification (with duplicate check)
   */
  async createNotification(userId, fromUserId, type, postId = null) {
    try {
      // Don't notify user about their own actions
      if (userId === fromUserId) {
        return null;
      }

      // Check if similar notification already exists recently
      const exists = await this.notificationRepository.notificationExists(
        userId, 
        fromUserId, 
        type, 
        postId
      );

      if (exists) {
        return null; // Don't create duplicate
      }

      const notification = await this.notificationRepository.createNotification(
        userId, 
        fromUserId, 
        type, 
        postId
      );

      // Send real-time notification via WebSocket
      if (notification) {
        this._sendRealtimeNotification(userId, notification);
      }

      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      const notifications = await this.notificationRepository.getUserNotifications(
        userId, 
        limit, 
        offset
      );

      const unreadCount = await this.notificationRepository.getUnreadCount(userId);

      return {
        notifications,
        unreadCount,
        page,
        limit,
        hasMore: notifications.length === limit
      };
    } catch (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    try {
      return await this.notificationRepository.getUnreadCount(userId);
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      await this.notificationRepository.markAsRead(notificationId, userId);
      return { success: true, message: 'Notification marked as read' };
    } catch (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      await this.notificationRepository.markAllAsRead(userId);
      return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
      throw new Error(`Failed to mark all as read: ${error.message}`);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      await this.notificationRepository.deleteNotification(notificationId, userId);
      return { success: true, message: 'Notification deleted' };
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Create notification for like
   */
  async notifyLike(postOwnerId, likerId, postId) {
    try {
      return await this.createNotification(postOwnerId, likerId, 'like', postId);
    } catch (error) {
      console.error('Error creating like notification:', error);
      return null;
    }
  }

  /**
   * Remove notification for unlike
   */
  async removeNotifyLike(postOwnerId, unlikerId, postId) {
    try {
      await this.notificationRepository.deleteByTypeAndPost(
        postOwnerId, 
        unlikerId, 
        'like', 
        postId
      );

      // Send WebSocket event to remove notification from frontend
      if (global.webSocketService) {
        global.webSocketService.sendRemoveNotification(postOwnerId, 'like', unlikerId, postId);
        
        // Update unread count
        this.notificationRepository.getUnreadCount(postOwnerId)
          .then(count => {
            global.webSocketService.sendUnreadCountUpdate(postOwnerId, count);
          })
          .catch(err => console.error('Error fetching unread count:', err));
      }
    } catch (error) {
      console.error('Error removing like notification:', error);
    }
  }

  /**
   * Create notification for comment
   */
  async notifyComment(postOwnerId, commenterId, postId) {
    try {
      return await this.createNotification(postOwnerId, commenterId, 'comment', postId);
    } catch (error) {
      console.error('Error creating comment notification:', error);
      return null;
    }
  }

  /**
   * Create notification for follow
   */
  async notifyFollow(followedUserId, followerId) {
    try {
      return await this.createNotification(followedUserId, followerId, 'follow', null);
    } catch (error) {
      console.error('Error creating follow notification:', error);
      return null;
    }
  }

  /**
   * Remove notification for unfollow
   */
  async removeNotifyFollow(unfollowedUserId, unfollowerId) {
    try {
      await this.notificationRepository.deleteByTypeAndPost(
        unfollowedUserId, 
        unfollowerId, 
        'follow', 
        null
      );

      // Send WebSocket event to remove notification from frontend
      if (global.webSocketService) {
        global.webSocketService.sendRemoveNotification(unfollowedUserId, 'follow', unfollowerId, null);
        
        // Update unread count
        this.notificationRepository.getUnreadCount(unfollowedUserId)
          .then(count => {
            global.webSocketService.sendUnreadCountUpdate(unfollowedUserId, count);
          })
          .catch(err => console.error('Error fetching unread count:', err));
      }
    } catch (error) {
      console.error('Error removing follow notification:', error);
    }
  }

  /**
   * Notify followers about new post
   */
  async notifyNewPost(postOwnerId, postId, followerRepository) {
    try {
      // Get all followers of the post owner
      const followers = await followerRepository.getFollowers(postOwnerId);
      
      console.log(`📢 Notifying ${followers.length} followers about new post ${postId}`);
      
      // Create notification for each follower
      const notifications = [];
      for (const follower of followers) {
        const notification = await this.createNotification(
          follower.follower_id, 
          postOwnerId, 
          'new_post', 
          postId
        );
        if (notification) {
          notifications.push(notification);
        }
      }
      
      console.log(`✅ Created ${notifications.length} new post notifications`);
      return notifications;
    } catch (error) {
      console.error('Error creating new post notifications:', error);
      return [];
    }
  }
}

module.exports = NotificationService;
