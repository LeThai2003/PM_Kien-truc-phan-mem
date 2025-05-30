const authService = require("../services/auth.service");
const forgotPasswordService = require("../services/forgotPassord.service")

// [POST] /auth/sign-up
exports.register = async (req, res, next) => {
  try {
    await authService.register(req, next);
    return res.status(200).json({message: "User register succesfully"});
  } catch (error) {
    next(error);
  }
}

// [POST] /auth/login
exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json({message: "User login succesfully", user: result.user, accessToken: result.accessToken});
  } catch (error) {
    next(error);
  }
}

// [POST] /auth/password-forgot
module.exports.passwordForgot = async (req, res, next) => {
  try {
    const {email} = req.body;
    await forgotPasswordService.forgotPassword(email);
    return res.status(200).json({message: "Send the OTP code to email successfully"});
  } catch (error) {
    next(error);
  }
}

// [POST] /auth/password-otp
module.exports.passwordOtp = async (req, res, next) => {
  try {
    const {email, otp} = req.body;
    const resetPasswordToken = await forgotPasswordService.otpPassword(email, otp);
    res.status(200).json({message: "Enter the otp code successfully", resetPasswordToken});
  } catch (error) {
    next(error);
  }
}

// [POST] /auth/password-reset
module.exports.passwordReset = async (req, res, next) => {
  try {
    const {newPassword, resetPasswordToken} = req.body;
    await forgotPasswordService.resetPassword(newPassword, resetPasswordToken);
    return res.status(200).json({message: "Reset password successfully"});
  } catch (error) {
    next(error);
  }
}