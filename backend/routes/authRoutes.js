// /backend/routes/authRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/authController');  // Use ../controllers instead of ./controllers
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
