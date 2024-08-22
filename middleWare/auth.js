const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.userId = user.userId;
    next();
  });
};

module.exports = authenticateToken;
