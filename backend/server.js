// /backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB 🔥'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

// Protected Route
app.get('/api/protected-route', authMiddleware, (req, res) => {
  res.json({ message: `Welcome! You are authenticated as user ${req.user.userId}` });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
