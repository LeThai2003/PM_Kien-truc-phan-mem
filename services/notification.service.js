const NotificationRepo = require("../repositories/notification.repository");

const NotificationService = {
  getAllNotificationsByUserId: async (userId) => {
    return await NotificationRepo.findAllByUserId(userId);
  },

  updateSeenNotification: async (id) => {
    await NotificationRepo.updateSeen(id);
  }
}

module.exports = NotificationService;