// /routes/businessDashboardRoutes.js
const express = require('express');
const {
  submitBooking,
  rescheduleBooking,
  cancelBooking,
  getBookings,
  getServices,
  addService,
  updateService,
  deleteService,
  addAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailability,
  getSettings
} = require('../controllers/businessDashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Bookings routes
router.get('/bookings', authMiddleware, getBookings);
router.post('/booking/create', authMiddleware, submitBooking);
router.put('/booking/reschedule', authMiddleware, rescheduleBooking);
router.delete('/booking/cancel', authMiddleware, cancelBooking);

// Services routes
router.get('/services', authMiddleware, getServices);
router.post('/service/add', authMiddleware, addService);
router.put('/service/update', authMiddleware, updateService);
router.delete('/service/delete', authMiddleware, deleteService);

// Availability routes
router.get('/availability', authMiddleware, getAvailability);
router.post('/availability/add', authMiddleware, addAvailability);
router.put('/availability/update', authMiddleware, updateAvailability);
router.delete('/availability/delete', authMiddleware, deleteAvailability);

// Settings route
router.get('/settings', authMiddleware, getSettings);




module.exports = router;
