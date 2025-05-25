const userRepo = require("../repositories/user.repository");
const tokenFactory = require("../factories/tokenFactory");
const { createError } = require("../utils/createError");
const { convertToSlug } = require("../utils/convertToSlug");
const bcrypt = require("bcrypt");


class AuthService{
  async register(req) {
    const {fullname, email, password, profileImageUrl} = req.body;

    const existing = await userRepo.findByEmail(email);
    if(existing) throw createError(409, "Email already exists");

    const user = await userRepo.createUser({ 
      email, 
      password,  
      fullname,
      slugName: convertToSlug(fullname),
      profilePicture: profileImageUrl
    });
  }

  async login(email, password) {
    const userExist = await userRepo.findByEmail(email);
    if(!userExist) throw createError(409, "Email not exists");
    const valid = await userExist.comparePassword(password);
    if (!valid) throw createError(400, "wrong password");

    const user = userExist.toObject();
    delete user.password;
    delete user.refreshToken;

    return({
      accessToken: tokenFactory.generateToken("access", { id: user._id }),
      user
    });
  }



}

module.exports = new AuthService();
