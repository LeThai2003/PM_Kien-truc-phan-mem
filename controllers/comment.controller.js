const commentService = require("../services/comment.service");

// [POST] /comment/:taskId
module.exports.create = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {taskId} = req.params;
    const data = req.body;

    const result = await commentService.createComment(data, userId, taskId);
    return res.status(200).json({message: "Commented successfully", comment: result});
  } catch (error) {
    next(error);
  }
}

// [GET] /comment/:taskId
module.exports.getAll = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {taskId} = req.params;

    const result = await commentService.getComments(userId, taskId);
    return res.status(200).json({message: "Get comments successfully", comments: result});
  } catch (error) {
    next(error);
  }
}

// [PATCH] /comment/:id
module.exports.updateComment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {id} = req.params;  // commentId
    const data = req.body;

    const result = await commentService.updateComment(data, userId, id);
    return res.status(200).json({message: "Updated successfully", comment: result});
  } catch (error) {
    next(error);
  }
}

// [DELETE] /comment/:id
module.exports.deleteComment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {id} = req.params;  // commentId

    const result = await commentService.deleteComment(id, userId);
    return res.status(200).json({message: "Deleted successfully"});
  } catch (error) {
    next(error);
  }
}

// [DELETE] /comment/like/:id
module.exports.updateLike = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {id} = req.params;  // commentId
    await commentService.toggleLikeComment(id, userId);
    return res.status(200).json({message: "Updated like successfully"});
  } catch (error) {
    next(error);
  }
}