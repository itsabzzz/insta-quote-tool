// /backend/routes/businessRoutes.js

const express = require('express');
const { getPlaces, getQuote, submitBooking, getDistance } = require('../controllers/businessController');
const router = express.Router();

// Define the routes
router.get('/places', getPlaces);
router.post('/get-quote', getQuote);
router.post('/submit-booking', submitBooking);
router.post('/get-distance', getDistance);

module.exports = router;
