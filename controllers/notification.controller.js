const NotificationService = require("../services/notification.service");

// [GET] /notification
module.exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;
    const notifications = await NotificationService.getAllNotificationsByUserId(userId);
    return res.status(200).json({message: "Get notifications successfully", notifications});
  } catch (error) {
    next(error);
  }
}

// [PATCH] /notification/update-seen/:id
module.exports.updateSeen = async (req, res, next) => {
  try {
    const {id} = req.params;
    await NotificationService.updateSeenNotification(id);
    return res.status(200).json("Seen Notification");
  } catch (error) {
    next(error);
  }
}
