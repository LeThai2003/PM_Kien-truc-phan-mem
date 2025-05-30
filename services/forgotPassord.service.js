const bcrypt = require("bcrypt");
const UserRepo = require("../repositories/user.repository");
const ForgotPasswordRepo = require("../repositories/forgotPassword.repository");
const MailFactory = require("../factories/mailFactory");
const TokenFactory = require("../factories/tokenFactory");
const { createError } = require("../utils/createError");
const { generateRandomNumber } = require("../utils/generate");

const ForgotPasswordService = {
  forgotPassword: async (email) => {
    const user = await UserRepo.findByEmail(email);
    if(!user) throw createError((400, "Email not found"));

    await ForgotPasswordRepo.deleteOtps(email);

    const otp = generateRandomNumber(8);

    const dataSave = {email, otp};
    await ForgotPasswordRepo.create(dataSave);

    await MailFactory.sendOtpPassword({email, otp});
  },

  otpPassword: async (email, otp) => {
    const recordExist = await ForgotPasswordRepo.findByEmail(email);
    if(!recordExist) throw createError(400, "No data");
    if(recordExist.otp !== otp) throw createError(400, "OTP wrong");

    const resetPasswordToken = TokenFactory.generateToken("resetPassword", {email, type: "reset-password"});
    await ForgotPasswordRepo.deleteOtps(email);

    return resetPasswordToken;
  },

  resetPassword: async (newPassword, resetPasswordToken) => {
    try {
      const decoded = TokenFactory.verifyToken("resetPassword", resetPasswordToken);
      const { email, type } = decoded;

      if(type !== "reset-password") throw createError(400, "Token is not valid");
      
      const user = await UserRepo.findByEmail(email);
      if(!user) throw createError(400, "Token is not valid");

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      await UserRepo.updatePassword(user._id, newPasswordHash);
    } catch (error) {
      throw createError(400, error.name + ": " + error.message);
    }
  }

}

module.exports = ForgotPasswordService;