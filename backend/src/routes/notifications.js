const express = require('express');
const auth = require('../middleware/auth');
const { idValidation, paginationValidation } = require('../middleware/validation');

/**
 * Create notification routes with dependency injection
 * @param {DIContainer} container - The DI container
 * @returns {Router} Express router with notification routes
 */
function createNotificationRoutes(container) {
  const router = express.Router();
  const notificationController = container.resolve('notificationController');

  // Get all notifications for current user
  router.get('/', auth, paginationValidation, notificationController.getNotifications);

  // Get unread count
  router.get('/unread-count', auth, notificationController.getUnreadCount);

  // Mark all as read
  router.put('/read-all', auth, notificationController.markAllAsRead);

  // Mark specific notification as read
  router.put('/:id/read', auth, idValidation, notificationController.markAsRead);

  // Delete notification
  router.delete('/:id', auth, idValidation, notificationController.deleteNotification);

  return router;
}

module.exports = createNotificationRoutes;
