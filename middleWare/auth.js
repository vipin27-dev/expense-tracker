const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.error('Token is missing');
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.sendStatus(403); // Forbidden
    }

    try {
      // Optionally, verify that the user exists in the database
      const foundUser = await User.findByPk(user.userId);
      if (!foundUser) {
        console.error('User not found');
        return res.sendStatus(403); // Forbidden
      }
      
      req.userId = user.userId;
      next();
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      return res.sendStatus(500); // Internal Server Error
    }
  });
};

module.exports = authenticateToken;
