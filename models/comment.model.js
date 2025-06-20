const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  taskId: {type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true},
  message: {type: String},
  imagesUrl: [{type: String}],
  file: {type: String},
  parentId: {type: String},
  like: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date},
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;