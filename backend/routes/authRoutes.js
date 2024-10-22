// /routes/authRoutes.js
const express = require('express');
const { businessSignup, businessLogin } = require('../controllers/businessDashboardController');
const router = express.Router();

// Business login and signup routes
router.post('/signup', businessSignup); // Use businessSignup
router.post('/login', businessLogin);   // Use businessLogin

module.exports = router;
