// /backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Add the decoded token data to the request
    next();  // Move to the next middleware or route
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
