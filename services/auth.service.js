const userRepo = require("../repositories/user.repository");
const tokenFactory = require("../factories/tokenFactory");
const { createError } = require("../utils/createError");
const { convertToSlug } = require("../utils/convertToSlug");
const bcrypt = require("bcrypt");
const { generateRandomString } = require("../utils/generate");


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

    const refreshToken = tokenFactory.generateToken("refresh", { id: user._id});

    await userRepo.update(user._id, {refreshToken: refreshToken});

    return({
      accessToken: tokenFactory.generateToken("access", { id: user._id }),
      refreshToken,
      user
    });
  }

  async google(email, fullname, photo) {
    const userExist = await userRepo.findByEmail(email);
    if(userExist){
      return({
        accessToken: tokenFactory.generateToken("access", { id: userExist._id }),
        user: userExist
      });
    } else {
      const user = await userRepo.createUser({ 
        email, 
        password: generateRandomString(8),  
        fullname,
        slugName: convertToSlug(fullname),
        profilePicture: photo
      });

      return({
        accessToken: tokenFactory.generateToken("access", { id: user._id }),
        user
      });
    }
  }

  async refreshTokenUser(refreshToken){
    try {
      const decoded = tokenFactory.verifyToken("refresh", refreshToken);
      const {id} = decoded;

      const newAccessToken = tokenFactory.generateToken("access", { id: id });
      const newRefreshToken = tokenFactory.generateToken("refresh", { id: id});

      await userRepo.update(id, {refreshToken: newRefreshToken});

      return({newAccessToken, newRefreshToken});
    } catch (error) {
      throw createError(400, error.name + " " + error.message);
    }
  }

  async logout(userId, refreshToken) {
    const user = await userRepo.findRefreshTokenById(userId);
    await userRepo.update(user._id, {refreshToken: ""});
    if(user.refreshToken !== refreshToken) throw createError(400, "Refresh token is not valid");
  }


}

module.exports = new AuthService();
