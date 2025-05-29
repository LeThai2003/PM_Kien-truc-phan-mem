const mongoose = require("mongoose");
const taskRepo = require("../repositories/task.repository");
const projectRepo = require("../repositories/project.repository");
const commentRepo = require("../repositories/comment.repository");
const notificationRepo = require("../repositories/notification.repository");
const userRepo = require("../repositories/user.repository");
const { createError } = require("../utils/createError");

const CommentService = {
  createComment: async (data, userId, taskId) => {
    const task = await taskRepo.findById(taskId);
    if(!task) throw createError(400, "Task not found");

    const project = await projectRepo.findById(task.projectId);
    const memberIds = [project.authorUserId._id, ...project.membersId?.map(m => m._id)];
    if(!memberIds.some(id => id.equals(userId))) throw createError(400, "Unauthorized to comment this task");

    if(!data?.message && !data?.imagesUrl?.length > 0 && !data?.file) throw createError(400, "Pleas enter content");

    data.userId = userId;
    data.taskId = taskId;

    const newComment = await commentRepo.create(data);

    const userFullname = await userRepo.findById(userId).fullname;

    // -------------socket------------------
    // ------ New comment ? Reply comment (parentId in data)
    
    // ------ Notification for task's author & assignee (necessary). Then save in database

    // -----------end socket----------------

    return newComment;
  },

  getComments: async (userId, taskId) => {
    const task = await taskRepo.findById(taskId);
    if(!task) throw createError(400, "Task not found");

    const project = await projectRepo.findById(task.projectId);
    const memberIds = [project.authorUserId._id, ...project.membersId?.map(m => m._id)];
    if(!memberIds.some(id => id.equals(userId))) throw createError(400, "Unauthorized to view comments");

    const comments = await commentRepo.getCommentsOfTask(taskId);
    return comments;
  },

  updateComment: async (data, userId, commentId) => {
    const comment = await commentRepo.findById(commentId);
    if(!comment) throw createError(400, "Comment not found");

    if(!comment.userId._id.equals(userId)) throw createError(400, "Unauthorized to edit comment");

    if(!data?.message && !data?.imagesUrl?.length > 0 && !data?.file) throw createError(400, "Pleas enter content");

    const updatedComment = await commentRepo.update(commentId, data);

    // -------socket update comment-----
    // -----end socket update comment---

    return updatedComment;
  },

  deleteComment: async (commentId, userId) => {
    const comment = await commentRepo.findById(commentId);
    if(!comment) throw createError(404, "Comment not found");
    if(!comment.userId._id.equals(userId)) throw createError(400, "Unauthorized to delete comment");

    // --------socket delete comment for room task (people are viewing) -------
    // ------end socket delete comment for room task (people are viewing) -----

    // --------- delete records with commentId in Notification + socket to delete on navbar's notification------
    const notifications = await notificationRepo.findNotificationByCommentId(commentId);
    // if(notifications.length > 0){
    //   // socket here
    // }
    await notificationRepo.deleteByCommentId(commentId);
    // -------end delete records with commentId in Notification + socket to delete on navbar's notification-----

    await commentRepo.delete(commentId);
  },

  toggleLikeComment: async (commentId, userId) => {
    const comment = await commentRepo.findById(commentId);
    const task = await taskRepo.findById(comment.taskId);
    const project = await projectRepo.findById(task.projectId);
    const memberIds = [project.authorUserId._id, ...project.membersId?.map(m => m._id)];
    if(!memberIds.some(id => id.equals(userId))) throw createError(400, "Unauthorized to like this task");

    comment.like?.some(id => id.equals(userId)) ? (
      await commentRepo.update(commentId, {$pull: {like: new mongoose.Types.ObjectId(userId)}})
    ) : (
      await commentRepo.update(commentId, {$push: {like: new mongoose.Types.ObjectId(userId)}})
    );

    // ---------socket announce comment update like------
    // -------end socket announce comment update like------
  }

}

module.exports = CommentService;