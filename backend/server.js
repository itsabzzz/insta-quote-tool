// /backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from this origin
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB 🔥'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const businessDashboardRoutes = require('./routes/businessDashboardRoutes'); // Add this line

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// Protected Route
app.get('/api/protected-route', authMiddleware, (req, res) => {
  res.json({ message: `Welcome! You are authenticated as user ${req.user.userId}` });
});

// Register the business dashboard routes
app.use('/api/business-dashboard', businessDashboardRoutes);  // Now this line should work

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
