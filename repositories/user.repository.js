const User = require("../models/user.model");

class UserRepository {
  findByEmail(email){
    return User.findOne({email});
  }

  createUser(user){
    return User.create(user);
  }

  updatePassword(userId, newPassword){
    return User.findByIdAndUpdate(userId, {password: newPassword});
  }

}

module.exports = new UserRepository();