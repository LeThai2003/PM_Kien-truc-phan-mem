const NotificationFactory = require("../factories/notificationFactory");
const Notification = require("../models/notification.model");

const NotificationRepository = {
  createAndSave: async (type, data) => {
    const notification = NotificationFactory.create(type, data);
    return await notification.save();
  },

  findNotificationByTaskId: async (taskId) => {
    return await Notification.find({taskId});
  },

  findNotificationByArrayTasksId: async (arrTasksId, projectId) => {
    return await Notification.find({
      $or: [
        {taskId: {$in: arrTasksId}},
        {projectId: projectId}
      ]
    }).select("_id");
  },

  deleteNotificationByArrayTasksId: async (arrTasksId, projectId) => {
    return await Notification.deleteMany({
      $or: [
        {taskId: {$in: arrTasksId}},
        {projectId: projectId}
      ]
    });
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

  findAllByUserId: async (userId) => {
    return await Notification.find({userId}).sort({createdAt: "desc"});
  },

  updateSeen: async (id) => {
    return await Notification.updateOne({_id: id}, {isSeen: true});
  }
}

module.exports = NotificationRepository;