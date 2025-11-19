const app = require("./app");
const http = require("http");
const {
  initSocket
} = require("./socket/index");
require("./events/listeners/commentEvent");
require("./events/listeners/notificationEvent");
require("./events/listeners/taskEvent");
require("./events/listeners/memberEvent");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));