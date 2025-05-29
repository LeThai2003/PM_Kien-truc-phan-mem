const {userTaskMap, onlineUsers} = require("../maps")

module.exports.handleJoinBack = (socket) => {
  socket.on("USER_LOGIN", (data) => {
    console.log("LOGIN", data);
  });

  socket.on("USER_VIEW_TASK", ({ userId, taskId }) => {
    console.log("VIEW TASK", userId);
    userTaskMap.set(userId, taskId);
    socket.join(`task-${taskId}`);
  });

  socket.on("USER_LEAVE_TASK", (data) => {
    console.log("Back", data);
    userTaskMap.delete(data.userId);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        userTaskMap.delete(userId);
        break;
      }
    }
  });
}