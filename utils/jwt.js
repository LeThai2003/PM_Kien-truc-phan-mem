const jwt = require("jsonwebtoken");

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

module.exports = {
  generateAccessToken(userId) {
    return jwt.sign({id: userId}, JWT_ACCESS_SECRET, {expiresIn: "1d"});
  },
  verifyToken(token){
    return jwt.verify(token, JWT_ACCESS_SECRET);
  }
}