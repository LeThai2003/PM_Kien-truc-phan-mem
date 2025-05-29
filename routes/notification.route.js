const express = require("express");
const {authenticateToken} = require("../middlewares/authenticate.middleware");
const NotificationController = require("../controllers/notification.controller");

const router = express.Router();

router.use(authenticateToken);

router.get("", NotificationController.getAllNotifications);

router.patch("/update-seen/:id", NotificationController.updateSeen); 

module.exports = router;