// /backend/controllers/authController.js
const User = require('../models/User');
const Business = require('../models/Business');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup controller
exports.signup = async (req, res) => {
  const { email, password, businessName, address } = req.body;

  // Create new business
  const business = new Business({ name: businessName, address });
  await business.save();

  // Create new user
  const user = new User({ email, password, businessId: business._id });
  await user.save();

  const token = jwt.sign({ userId: user._id, businessId: business._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, business });
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id, businessId: user.businessId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
