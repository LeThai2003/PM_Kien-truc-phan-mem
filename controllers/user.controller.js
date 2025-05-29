const UserService = require("../services/user.service");

// [PATCH] /user/update-profile/:id 
module.exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {id} = req.params;
    const data = req.body;
    const result = await UserService.updateProfileUser(id, userId, data);
    return res.status(200).json({message: "Update profile successfully", user: result});
  } catch (error) {
    next(error);
  }
}

// [PATCH] /user/update-account/:id
module.exports.updateAccount = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {id} = req.params;
    const data = req.body;
    await UserService.updatePasswordUser(id, userId, data);
    return res.status(200).json({message: "Update account successfully"});
  } catch (error) {
    next(error);
  }
}