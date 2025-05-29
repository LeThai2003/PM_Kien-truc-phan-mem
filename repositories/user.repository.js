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

  findById(userId){
    return User.findOne({_id: userId}).select("-password -refreshToken -createdAt -updatedAt");
  }

  update(userId, data){
    return User.findByIdAndUpdate(userId, data, {new: true});
  }

  getPassword(userId) {
    return User.findById(userId).select("password");
  }

  findUserBySearch(searchKey, slugSearch){
    return User.find({
      $or: [
        { slugName: {$regex: slugSearch} },
        { email: {$regex: searchKey, $options: "i"}}
      ]
    }).select("fullname email profilePicture major description")
  }

}

module.exports = new UserRepository();