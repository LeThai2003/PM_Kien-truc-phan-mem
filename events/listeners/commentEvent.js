const eventBus = require("../eventBus");
const EVENT_TYPES = require("../eventType");

eventBus.on(EVENT_TYPES.COMMENT.NEW, ({comment, taskId}) => {
  _io.to(`task-${taskId}`).emit(`SERVER_SEND_NEW_COMMENT`, { comment });
})

eventBus.on(EVENT_TYPES.COMMENT.REP, ({comment, taskId}) => {
  _io.to(`task-${taskId}`).emit(`SERVER_SEND_REP_COMMENT`, { comment });
})

eventBus.on(EVENT_TYPES.COMMENT.UPDATE, ({commentUpdate}) => {
  console.log(commentUpdate);
  _io.to(`task-${commentUpdate.taskId}`).emit(`SERVER_SEND_UPDATE_COMMENT`, { comment: commentUpdate });
})

eventBus.on(EVENT_TYPES.COMMENT.DELETE, ({comment}) => {
  _io.to(`task-${comment.taskId}`).emit(`SERVER_DELETE_COMMENT`, {commentId: comment._id});
})

eventBus.on(EVENT_TYPES.COMMENT.LIKE, ({comment, userId}) => {
  _io.to(`task-${comment.taskId}`).emit(`SERVER_UPDATE_LIKE_COMMENT`, {commentId: comment._id, userId});
})