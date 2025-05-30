const eventBus = require("../eventBus");
const EVENT_TYPES = require("../eventType");

eventBus.on(EVENT_TYPES.NOTIFICATION.NEW_COMMENT, ({notification}) => {
  _io.emit(`NOTIFICATION`, { notification });
})

eventBus.on(EVENT_TYPES.NOTIFICATION.DELETE_COMMENT, ({commentId, userId}) => {
  _io.emit(`NOTIFY_SERVER_DELETE_COMMENT`, { commentId, userId });
})

eventBus.on(EVENT_TYPES.NOTIFICATION.NEW_TASK, ({notification}) => {
  _io.emit(`NOTIFY_CREATE_NEW_TASK`, { notification });
})

eventBus.on(EVENT_TYPES.NOTIFICATION.DELETE_TASK, ({taskId, userId}) => {
  _io.emit(`NOTIFY_SERVER_DELETE_TASK`, {taskId, userId});
})

eventBus.on(EVENT_TYPES.NOTIFICATION.NEW_MEMBER, ({notification}) => {
  _io.emit(`MEMBER_ACCEPT_JOIN_PROJECT`, {notification});
})

