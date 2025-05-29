
module.exports.handleJoinBack = (socket) => {
  socket.on("USER_LOGIN", (data) => {
    console.log("LOGIN", data);
  });

  socket.on("USER_VIEW_TASK", ({ userId, taskId }) => {
    console.log("VIEW TASK", userId);
    socket.join(`task-${taskId}`);
  });

  socket.on("USER_LEAVE_TASK", (data) => {
    console.log("Back", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect");
  });
}