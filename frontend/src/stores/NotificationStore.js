// NotificationStore.js - Real-time notifications management with WebSocket
import { makeAutoObservable, runInAction } from 'mobx';
import { notificationService } from '../services/api';

class NotificationStore {
  notifications = [];
  unreadCount = 0;
  loading = false;
  error = null;
  hasMore = true;
  currentPage = 1;
  ws = null;
  wsConnected = false;
  wsConnecting = false; // Track connection state
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  /**
   * Connect to WebSocket server
   */
  connectWebSocket() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, cannot connect to WebSocket');
      return;
    }

    // If already connected, skip
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already active');
      return;
    }

    try {
      const wsUrl = `ws://localhost:5000/ws/notifications?token=${token}`;
      
      console.log(`🔌 Connecting to WebSocket...`);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        runInAction(() => {
          this.wsConnected = true;
          this.wsConnecting = false;
          this.reconnectAttempts = 0;
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = () => {
        runInAction(() => {
          this.wsConnecting = false;
        });
      };

      this.ws.onclose = (event) => {
        runInAction(() => {
          this.wsConnected = false;
          this.wsConnecting = false;
        });

        // Auto-reconnect only if not normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => {
            this.connectWebSocket();
          }, 2000 * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      runInAction(() => {
        this.wsConnecting = false;
      });
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleWebSocketMessage(message) {
    console.log('📨 WebSocket message received:', message);

    switch (message.type) {
      case 'connected':
        console.log('🎉 WebSocket connection confirmed');
        // Fetch initial notifications
        this.fetchNotifications(1);
        break;

      case 'notification':
        // New notification received in real-time
        this.handleNewNotification(message.data);
        break;

      case 'remove_notification':
        // Remove notification (e.g., after unlike)
        this.handleRemoveNotification(message.data);
        break;

      case 'unread_count':
        // Unread count update
        runInAction(() => {
          this.unreadCount = message.count;
        });
        break;

      case 'pong':
        // Pong response to ping
        console.log('🏓 Pong received');
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Handle new notification from WebSocket
   */
  handleNewNotification(notification) {
    runInAction(() => {
      // Add to beginning of notifications array
      this.notifications.unshift(notification);

      // Increment unread count if not read
      if (!notification.is_read) {
        this.unreadCount++;
      }
    });

    // Play sound or show browser notification (optional)
    this.showBrowserNotification(notification);
  }

  /**
   * Show browser notification (optional)
   */
  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = 'New Notification';
      const body = this.getNotificationText(notification);
      new Notification(title, { body, icon: '/logo192.png' });
    }
  }

  /**
   * Handle remove notification from WebSocket
   */
  handleRemoveNotification(data) {
    console.log('🗑️  Removing notification:', data);
    
    runInAction(() => {
      // Find and remove matching notification
      const index = this.notifications.findIndex(notif => 
        notif.type === data.type &&
        notif.from_user_id === data.from_user_id &&
        notif.post_id === data.post_id
      );

      if (index !== -1) {
        const wasUnread = !this.notifications[index].is_read;
        this.notifications.splice(index, 1);
        
        // Decrement unread count if it was unread
        if (wasUnread && this.unreadCount > 0) {
          this.unreadCount--;
        }
        
        console.log('✅ Notification removed from list');
      } else {
        console.log('⚠️  Notification not found in list');
      }
    });
  }

  getNotificationText(notification) {
    const name = notification.from_full_name || notification.from_username;
    switch (notification.type) {
      case 'like':
        return `${name} liked your post`;
      case 'comment':
        return `${name} commented on your post`;
      case 'follow':
        return `${name} started following you`;
      default:
        return 'New notification';
    }
  }

  /**
   * Send ping to keep connection alive
   */
  sendPing() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'ping' }));
    }
  }

  /**
   * Start keep-alive ping
   */
  startKeepAlive() {
    this.keepAliveInterval = setInterval(() => {
      this.sendPing();
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop keep-alive ping
   */
  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket() {
    this.stopKeepAlive();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    runInAction(() => {
      this.wsConnected = false;
      this.wsConnecting = false;
    });
  }

  /**
   * Fetch notifications
   */
  async fetchNotifications(page = 1, limit = 20) {
    this.loading = true;
    this.error = null;

    try {
      const response = await notificationService.getNotifications(page, limit);
      const { notifications, unreadCount, hasMore } = response.data;

      runInAction(() => {
        if (page === 1) {
          this.notifications = notifications;
        } else {
          this.notifications = [...this.notifications, ...notifications];
        }
        this.unreadCount = unreadCount;
        this.hasMore = hasMore;
        this.currentPage = page;
        this.loading = false;
      });

      return notifications;
    } catch (error) {
      runInAction(() => {
        this.error = error.response?.data?.message || error.message || 'Failed to load notifications';
        this.loading = false;
      });
      throw error;
    }
  }

  /**
   * Fetch unread count only
   */
  async fetchUnreadCount() {
    try {
      const response = await notificationService.getUnreadCount();
      
      runInAction(() => {
        this.unreadCount = response.data.count;
      });

      return response.data.count;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return this.unreadCount;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    // Optimistic update
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification || notification.is_read) {
      return; // Already read or not found
    }

    const wasRead = notification.is_read;
    const prevUnreadCount = this.unreadCount;

    runInAction(() => {
      notification.is_read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    });

    try {
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      // If notification doesn't exist (404), just remove it from list
      if (error.response?.status === 404 || error.message?.includes('not found')) {
        console.log('⚠️  Notification no longer exists, removing from list');
        runInAction(() => {
          this.notifications = this.notifications.filter(n => n.id !== notificationId);
        });
        return;
      }

      // Rollback on other errors
      runInAction(() => {
        notification.is_read = wasRead;
        this.unreadCount = prevUnreadCount;
      });
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const prevNotifications = [...this.notifications];
    const prevUnreadCount = this.unreadCount;

    // Optimistic update
    runInAction(() => {
      this.notifications.forEach(n => n.is_read = true);
      this.unreadCount = 0;
    });

    try {
      await notificationService.markAllAsRead();
    } catch (error) {
      // Rollback on error
      runInAction(() => {
        this.notifications = prevNotifications;
        this.unreadCount = prevUnreadCount;
      });
      console.error('Failed to mark all as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    const notificationIndex = this.notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex === -1) return;

    const deletedNotification = this.notifications[notificationIndex];
    const wasRead = deletedNotification.is_read;

    // Optimistic update
    runInAction(() => {
      this.notifications.splice(notificationIndex, 1);
      if (!wasRead) {
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });

    try {
      await notificationService.deleteNotification(notificationId);
    } catch (error) {
      // Rollback on error
      runInAction(() => {
        this.notifications.splice(notificationIndex, 0, deletedNotification);
        if (!wasRead) {
          this.unreadCount += 1;
        }
      });
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  /**
   * Load more notifications
   */
  async loadMore() {
    if (!this.hasMore || this.loading) {
      return;
    }

    await this.fetchNotifications(this.currentPage + 1);
  }

  /**
   * Refresh notifications (reload first page)
   */
  async refresh() {
    await this.fetchNotifications(1);
  }

  /**
   * Clear all notifications and state
   */
  clear() {
    this.disconnectWebSocket();
    this.notifications = [];
    this.unreadCount = 0;
    this.loading = false;
    this.error = null;
    this.hasMore = true;
    this.currentPage = 1;
  }

  /**
   * Request browser notification permission
   */
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }
}

export default NotificationStore;
