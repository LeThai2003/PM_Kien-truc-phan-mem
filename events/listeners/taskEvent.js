const eventBus = require("../eventBus");
const EVENT_TYPES = require("../eventType");

eventBus.on(EVENT_TYPES.TASK.NEW, ({task, relatedUserNotify}) => {
  _io.emit("SERVER_RETURN_NEW_TASK", {task, relatedUserNotify})
})

eventBus.on(EVENT_TYPES.TASK.UPDATE_DRAG, ({task, relatedUserNotify}) => {
  _io.emit("UPDATE_TASK_DRAG_DROP", { task, relatedUserNotify});
})

eventBus.on(EVENT_TYPES.TASK.UPDATE, ({task, relatedUserNotify}) => {
  _io.emit("UPDATE_TASK", { task, relatedUserNotify})
})
