const jwt = require("jsonwebtoken");

class TokenFactory{

  static secrets = {
    access: process.env.JWT_ACCESS_SECRET,
    refresh: process.env.JWT_REFRESH_SECRET,
    member: process.env.JWT_INVITE_MEMBER,
    resetPassword: process.env.JWT_INVITE_RESET_PASSWORD
  }

  static expirations = {
    access: "2d",
    refresh: "7d",
    member: "7d",
    resetPassword: "30m",
  }

  static generateToken(type, payload){
    const secret = this.secrets[type];
    const expiresIn = this.expirations[type];
    if(!secret || !expiresIn)
    {
      throw createError(400, `Token type "${type}" is not supported`);
    }
    return jwt.sign(payload, secret, {expiresIn})
  }

  static verifyToken(type, token){
    const secret = this.secrets[type];
    if(!secret)
    {
      throw createError(400, `Can not verify token of type "${type}"`);
    }
    return jwt.verify(token, secret);
  }
}

module.exports = TokenFactory;