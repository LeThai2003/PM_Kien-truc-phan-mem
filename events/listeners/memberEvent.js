const eventBus = require("../eventBus");
const EVENT_TYPES = require("../eventType");

eventBus.on(EVENT_TYPES.MEMBER.NEW, ({project, member}) => {
  console.log("------member------", project, member);
  _io.emit("ADD_MEMBER_TO_PROJECT", {project, member})
})