const ForgotPassword = require("../models/forgotPassword.model");

const ForgotPasswordRepository = {
  deleteOtps: async (email) => {
    await ForgotPassword.deleteMany({email: email});
  },

  create: async (data) => {
    await ForgotPassword.create(data);
  },

  findByEmail: async (email) => {
    return await ForgotPassword.findOne({email: email});
  }
}

module.exports = ForgotPasswordRepository;