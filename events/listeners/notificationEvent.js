const eventBus = require("../eventBus");
const EVENT_TYPES = require("../eventType");

eventBus.on(EVENT_TYPES.NOTIFICATION.NEW_COMMENT, ({notification}) => {
  _io.emit(`NOTIFICATION`, { notification });
})