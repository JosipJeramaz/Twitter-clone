class NotificationController {
  constructor(notificationService) {
    if (!notificationService) {
      throw new Error('NotificationService is required for NotificationController');
    }
    this.notificationService = notificationService;
  }

  /**
   * Get user notifications
   * GET /api/notifications
   */
  getNotifications = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.notificationService.getUserNotifications(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get unread count
   * GET /api/notifications/unread-count
   */
  getUnreadCount = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const count = await this.notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark notification as read
   * PUT /api/notifications/:id/read
   */
  markAsRead = async (req, res, next) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.notificationService.markAsRead(notificationId, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      // If notification doesn't exist (e.g., was deleted due to unlike), return success
      if (error.message.includes('not found') || error.message.includes('unauthorized')) {
        return res.status(200).json({
          success: true,
          message: 'Notification already removed or does not exist'
        });
      }
      next(error);
    }
  };

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  markAllAsRead = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const result = await this.notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete notification
   * DELETE /api/notifications/:id
   */
  deleteNotification = async (req, res, next) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user.id;

      const result = await this.notificationService.deleteNotification(notificationId, userId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = NotificationController;
