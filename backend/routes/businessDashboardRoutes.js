const express = require('express');
const { rescheduleBooking, cancelBooking } = require('../controllers/businessDashboardController');
const authMiddleware = require('../middleware/authMiddleware'); // Businesses need to be authenticated
const router = express.Router();


const { createTestBooking } = require('../controllers/businessDashboardController'); // Add this line

// Temporary route for testing booking creation
//router.post('/booking/create', authMiddleware, createTestBooking);



// Reschedule a booking
router.put('/booking/reschedule', authMiddleware, rescheduleBooking);

// Cancel a booking
router.delete('/booking/cancel', authMiddleware, cancelBooking);

module.exports = router;
