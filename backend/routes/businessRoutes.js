// /routes/businessRoutes.js
const express = require('express');
const { getPlaces, getQuote, submitBooking, getDistance } = require('../controllers/businessController'); 
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Define the routes
router.get('/places', getPlaces);  // No auth needed
router.post('/get-quote', getQuote);  // No auth needed
router.post('/submit-booking', authMiddleware, submitBooking); // Requires authentication
router.post('/get-distance', getDistance);  // No auth needed

module.exports = router;
