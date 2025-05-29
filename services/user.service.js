const bcrypt = require("bcrypt");
const UserRepo = require("../repositories/user.repository");
const { convertToSlug } = require("../utils/convertToSlug");
const { createError } = require("../utils/createError");

const UserService = {
  updateProfileUser: async (idUpdate, userId, data) => {
    if(idUpdate !== userId) throw createError(400, "Unauthorized to edit profile");
    const user = await UserRepo.findById(userId);
    if(user.email !== data.email){
      const emailExist = await UserRepo.findByEmail(data.email);
      if(emailExist) throw createError(400, "Email already exists");
    }

    if(data.fullname) data.slugName = convertToSlug(data.fullname);

    const updatedUser = await UserRepo.update(userId, data);
    return updatedUser;
  },

  updatePasswordUser: async (idUpdate, userId, data) => {
    if(idUpdate !== userId) throw createError(400, "Unauthorized!");
    if(data.newPassword !== data.confirmNewPassword) throw createError(400, "Confirm password wrong");
    const userPassword = await UserRepo.getPassword(userId);

    const validPassword = await userPassword.comparePassword(data.oldPassword);
    if(!validPassword) throw createError(400, "Wrong password");
    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
    await UserRepo.updatePassword(userId, newPasswordHash);
  }
}

module.exports = UserService;