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

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

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

// [POST] /auth/google
module.exports.google = async (req, res, next) => {
  try {
    const {email, fullname, photo} = req.body;
    const {user, accessToken} = await authService.google(email, fullname, photo);
    return res.status(200).json({message: "Auth with google successful", user, accessToken});
  } catch (error) {
    next(error);
  }
}

// [POST] /auth/refresh-token
module.exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const {newAccessToken, newRefreshToken} = await authService.refreshTokenUser(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({message: "Refresh Token Successfully", accessToken: newAccessToken});
  } catch (error) {
    next(error);
  }
}

// [POST] /auth/logout
module.exports.logout = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {refreshToken} = req.cookies;
    await authService.logout(userId, refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json("Logut successfully");
  } catch (error) {
    next(error);
  }
}

