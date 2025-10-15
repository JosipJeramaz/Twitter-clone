import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../hooks/useStores';
import './NotificationBell.css';

const NotificationBell = observer(() => {
  const notificationStore = useNotificationStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications when opening dropdown
  useEffect(() => {
    if (isOpen && notificationStore.notifications.length === 0) {
      notificationStore.fetchNotifications();
    }
  }, [isOpen]);

  // Connect to WebSocket on mount
  useEffect(() => {
    // Connect to WebSocket
    notificationStore.connectWebSocket();
    notificationStore.startKeepAlive();

    // Request browser notification permission
    notificationStore.requestNotificationPermission();

    // DON'T disconnect on unmount in development
    // React Strict Mode causes double mounting
    return () => {
      // Only disconnect in production
      if (process.env.NODE_ENV === 'production') {
        notificationStore.disconnectWebSocket();
      }
    };
  }, [notificationStore]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await notificationStore.markAsRead(notification.id);
      } catch (error) {
        // Ignore error if notification doesn't exist
        console.log('⚠️  Could not mark notification as read (may have been deleted)');
      }
    }

    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.from_username}`);
    } else if (notification.post_id) {
      // For likes and comments, could navigate to post detail
      navigate(`/profile/${notification.from_username}`);
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationStore.markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await notificationStore.deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '@';
      case 'new_post':
        return '📝';
      default:
        return '🔔';
    }
  };

  const getNotificationText = (notification) => {
    const name = notification.from_full_name || notification.from_username;
    switch (notification.type) {
      case 'like':
        return `${name} liked your post`;
      case 'comment':
        return `${name} commented on your post`;
      case 'follow':
        return `${name} started following you`;
      case 'mention':
        return `${name} mentioned you`;
      case 'new_post':
        return `${name} posted something new`;
      default:
        return 'New notification';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="notification-bell-button" 
        onClick={toggleDropdown}
        aria-label="Notifications"
        title={notificationStore.wsConnected ? 'Real-time notifications (connected)' : 'Notifications (connecting...)'}
      >
        🔔
        {notificationStore.unreadCount > 0 && (
          <span className="notification-badge">
            {notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount}
          </span>
        )}
        {/* WebSocket connection indicator */}
        <span className={`ws-indicator ${notificationStore.wsConnected ? 'connected' : 'disconnected'}`}></span>
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {notificationStore.unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notificationStore.loading && notificationStore.notifications.length === 0 ? (
              <div className="notification-loading">Loading...</div>
            ) : notificationStore.notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications yet</p>
              </div>
            ) : (
              notificationStore.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-text">
                      {getNotificationText(notification)}
                    </div>
                    {notification.post_content && (
                      <div className="notification-post-preview">
                        "{notification.post_content.substring(0, 50)}
                        {notification.post_content.length > 50 ? '...' : ''}"
                      </div>
                    )}
                    <div className="notification-time">
                      {formatTime(notification.created_at)}
                    </div>
                  </div>
                  <button
                    className="notification-delete-btn"
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                    aria-label="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {notificationStore.hasMore && !notificationStore.loading && (
            <button 
              className="load-more-btn"
              onClick={() => notificationStore.loadMore()}
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export default NotificationBell;
