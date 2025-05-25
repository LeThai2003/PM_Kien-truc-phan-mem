const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    await authService.register(req, next);
    return res.status(200).json({message: "User register succesfully"});
  } catch (error) {
    next(error);
  }
}

exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json({message: "User login succesfully", user: result.user, accessToken: result.accessToken});
  } catch (error) {
    next(error);
  }
}