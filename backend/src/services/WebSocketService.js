const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

/**
 * WebSocketService manages WebSocket connections and broadcasts notifications
 */
class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // userId -> WebSocket connection
  }

  /**
   * Initialize WebSocket server
   * @param {http.Server} server - HTTP server instance
   */
  initialize(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws/notifications'
    });

    this.wss.on('connection', (ws, req) => {
      console.log('📡 New WebSocket connection attempt');

      // Extract token from query string
      const urlParams = new URLSearchParams(req.url.split('?')[1]);
      const token = urlParams.get('token');

      if (!token) {
        console.log('❌ No token provided, closing connection');
        ws.close(1008, 'Authentication required');
        return;
      }

      // Verify JWT token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        console.log(`✅ WebSocket authenticated for user ${userId}`);

        // Store connection
        this.clients.set(userId, ws);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connected',
          message: 'WebSocket connected successfully',
          userId: userId
        }));

        // Handle messages from client
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            console.log('📨 Received message from client:', data);
            
            // Handle ping/pong for keep-alive
            if (data.type === 'ping') {
              ws.send(JSON.stringify({ type: 'pong' }));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        // Handle connection close
        ws.on('close', () => {
          console.log(`🔌 WebSocket disconnected for user ${userId}`);
          this.clients.delete(userId);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error(`❌ WebSocket error for user ${userId}:`, error);
          this.clients.delete(userId);
        });

      } catch (error) {
        console.log('❌ Invalid token, closing connection');
        ws.close(1008, 'Invalid authentication token');
      }
    });

    console.log('🚀 WebSocket server initialized on path /ws/notifications');
  }

  /**
   * Send notification to a specific user
   * @param {number} userId - User ID to send notification to
   * @param {object} notification - Notification data
   */
  sendNotificationToUser(userId, notification) {
    const ws = this.clients.get(userId);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));
        console.log(`📬 Notification sent to user ${userId}:`, notification.type);
        return true;
      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
        return false;
      }
    } else {
      console.log(`📭 User ${userId} not connected, skipping real-time notification`);
      return false;
    }
  }

  /**
   * Send unread count update to a specific user
   * @param {number} userId - User ID
   * @param {number} count - Unread count
   */
  sendUnreadCountUpdate(userId, count) {
    const ws = this.clients.get(userId);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'unread_count',
          count: count
        }));
        console.log(`🔢 Unread count (${count}) sent to user ${userId}`);
        return true;
      } catch (error) {
        console.error(`Error sending unread count to user ${userId}:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * Notify user to remove a notification (e.g., after unlike)
   * @param {number} userId - User ID
   * @param {string} type - Notification type (like, comment, follow)
   * @param {number} fromUserId - ID of user who performed the action
   * @param {number|null} postId - Post ID if applicable
   */
  sendRemoveNotification(userId, type, fromUserId, postId = null) {
    const ws = this.clients.get(userId);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
          type: 'remove_notification',
          data: {
            type: type,
            from_user_id: fromUserId,
            post_id: postId
          }
        }));
        console.log(`🗑️  Remove notification sent to user ${userId}: ${type}`);
        return true;
      } catch (error) {
        console.error(`Error sending remove notification to user ${userId}:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * Broadcast message to all connected clients
   * @param {object} message - Message to broadcast
   */
  broadcast(message) {
    let sentCount = 0;
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.error(`Error broadcasting to user ${userId}:`, error);
        }
      }
    });
    console.log(`📢 Broadcast sent to ${sentCount} clients`);
  }

  /**
   * Get number of connected clients
   */
  getConnectedCount() {
    return this.clients.size;
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId) {
    return this.clients.has(userId);
  }

  /**
   * Close all connections
   */
  closeAll() {
    this.clients.forEach((ws) => {
      ws.close();
    });
    this.clients.clear();
    console.log('🔌 All WebSocket connections closed');
  }
}

// Export singleton instance
module.exports = new WebSocketService();
