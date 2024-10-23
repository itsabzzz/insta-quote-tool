// /middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token
  console.log('Token:', token);  // Log the token for debugging

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify and decode the token
    console.log('Decoded Token:', decoded);  // Log the decoded token for debugging
    req.user = { businessId: decoded.businessId };  // Explicitly set businessId in req.user
    next();
  } catch (err) {
    console.error('Error decoding token:', err);  // Log the error if token verification fails
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;


