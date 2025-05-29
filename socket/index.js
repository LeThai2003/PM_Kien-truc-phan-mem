const {Server} = require("socket.io");
const {handleJoinBack} = require("./handles/handleJoinBack");

module.exports.initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  global._io = io;

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);
    handleJoinBack(socket);
  });
}