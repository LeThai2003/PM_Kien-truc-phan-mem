const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");

class TokenFactory{

  static secrets = {
    access: process.env.JWT_ACCESS_SECRET,
    member: process.env.JWT_INVITE_MEMBER,
  }

  static expirations = {
    access: "1d",
    member: "7d",
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