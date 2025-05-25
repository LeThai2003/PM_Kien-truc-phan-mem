const jwt = require("jsonwebtoken");
const { createError } = require("../utils/createError");

const secrets = {
  access: process.env.JWT_ACCESS_SECRET,

}

const expirations = {
  access: "1d",
}

class TokenFactory{
  static generateToken(type, payload){
    const secret = secrets[type];
    const expiresIn = expirations[type];
    if(!secret || !expiresIn)
    {
      throw createError(400, `Token type "${type}" is not supported`);
    }
    return jwt.sign(payload, secret, {expiresIn})
  }

  static verifyToken(type, token){
    const secret = secrets[type];
    if(!secret)
    {
      throw createError(400, `Can not verify token of type "${type}"`);
    }
    return jwt.verify(token, secret);
  }
}

module.exports = TokenFactory;