const Comment = require("../models/comment.model");

const CommentRepository = {
  create: async (data) => {
    return (await Comment.create(data)).populate("userId", "fullname profilePicture");
  },

  getCommentsOfTask: async (taskId) => {
    return await Comment.find({taskId})
      .populate("userId", "fullname profilePicture");
  },

  update: async (commentId, data) => {
    return await Comment.findByIdAndUpdate(commentId, data, {new: true})
      .populate("userId", "fullname profilePicture");
  },

  delete: async (commentId) => {
    await Comment.deleteMany({
      $or: [
        {_id: commentId},
        {parentId: commentId}
      ]
    });
  },

  findById: async (commentId) => {
    return await Comment.findById(commentId)
      .populate("userId", "fullname profilePicture");
  },

  findCommentOfArrayTasksId: async (arrTasksId) => {
    return await Comment.find({taskId: {$in: arrTasksId}}).select("_id");
  },

  deleteCommentByArrayTasksId: async (arrTasksId) => {
    return await Comment.deleteMany({taskId: {$in: arrTasksId}});
  },

}

module.exports = CommentRepository;