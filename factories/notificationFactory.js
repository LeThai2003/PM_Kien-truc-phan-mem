const Notification = require("../models/notification.model");
const { createError } = require("../utils/createError");

const NotificationFactory = {
  create(type, data){
    switch (type) {
      case "member":
        return this.createMemberJoinNotification(data);
      case "task":
        return this.createTaskCreatedNotification(data);
      case "comment":
        return ;
      default:
        throw createError(400, `Unknow notification type: ${type}`);
    }
  },

  createMemberJoinNotification({member, project}){
    return new Notification({
      type: "member",
      title: `${member.fullname} has joined project ${project.name}`,
      projectId: project._id,
      userId: project.authorUserId._id
    });
  },

  createTaskCreatedNotification({user, task, project, targetUserId }){
    return new Notification({
      type: "task",
      title: `${user.fullname} added task ${task.title} to project ${project.name}`,
      projectId: project._id,
      taskId: task._id,
      userId: targetUserId 
   })
  },

  createCommentNotification({user, task, comment, targetUserId}){
    return new Notification({
      type: "comment",
      title: `${user.fullname} commented on task ${task.title}`,
      commentId: comment._id,
      taskId: task._id,
      userId: targetUserId
    })
  }
}

module.exports = NotificationFactory;