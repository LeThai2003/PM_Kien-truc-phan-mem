const tokenFactory = require("../factories/tokenFactory");

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(!token) return res.sendStatus(401);

  try {
    const decoded = tokenFactory.verifyToken("access", token);

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}