const express = require("express");
const {authenticateToken} = require("../middlewares/authenticate.middleware");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.use(authenticateToken);

router.patch("/update-profile/:id", userController.updateProfile);

router.patch("/update-account/:id", userController.updateAccount);

module.exports = router;