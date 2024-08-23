const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.sendStatus(403); // Forbidden
        }

        try {
            const foundUser = await User.findByPk(decoded.userId);
            if (!foundUser) {
                return res.sendStatus(403); // Forbidden
            }

            req.userId = decoded.userId; // Set userId if available
            next();
        } catch (dbError) {
            console.error('Database error:', dbError.message);
            return res.sendStatus(500); // Internal Server Error
        }
    });
};

module.exports = authenticateToken;
