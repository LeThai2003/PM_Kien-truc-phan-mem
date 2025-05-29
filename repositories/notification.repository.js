const NotificationFactory = require("../factories/notificationFactory");
const Notification = require("../models/notification.model");

const NotificationRepository = {
  createAndSave: async (type, data) => {
    const notification = NotificationFactory.create(type, data);
    await notification.save();
  },

  findNotificationByTaskId: async (taskId) => {
    return await Notification.find({taskId});
  },

  deleteByTaskId: async (taskId) => {
    await Notification.deleteMany({taskId});
  },

  deleteByCommentId: async (commentId) => {
    await Notification.deleteMany({commentId});
  },
  
  findNotificationByCommentId: async (commentId) => {
    return await Notification.find({commentId});
  },
}

module.exports = NotificationRepository;