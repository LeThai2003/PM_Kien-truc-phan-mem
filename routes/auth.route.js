const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {authenticateToken} = require("../middlewares/authenticate.middleware");

router.post("/sign-up", authController.register);

router.post("/login", authController.login);

// router.post("/logout", authenticateToken, authController.logout);

// router.post("/google", authController.google);

router.post("/password-forgot", authController.passwordForgot);

router.post("/password-otp", authController.passwordOtp);

router.post("/password-reset", authController.passwordReset);

// router.post("/refresh-token", authController.refreshToken);


module.exports = router;