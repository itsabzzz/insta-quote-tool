// /routes/businessDashboardRoutes.js
const express = require('express');
const {
  submitBooking,
  rescheduleBooking,
  cancelBooking,
  getBookings,
  approveBooking,
  declineBooking,

  getServices,
  addService,
  updateService,
  deleteService,

  addAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailability,
  
  getSettings,


} = require('../controllers/businessDashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Bookings routes
router.get('/bookings', authMiddleware, getBookings);
router.post('/booking/create', authMiddleware, submitBooking);
router.put('/booking/reschedule', authMiddleware, rescheduleBooking);
router.delete('/booking/cancel', authMiddleware, cancelBooking);
router.put('/booking/approve', authMiddleware, approveBooking);
router.put('/booking/decline', authMiddleware, declineBooking);


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

// /routes/businessDashboardRoutes.js
// Approve Booking
router.put('/booking/approve/:bookingId', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Check availability (ensure no overlap)
    const conflictingBooking = await Booking.findOne({
      businessId: booking.businessId,
      'bookingTime.day': booking.bookingTime.day,
      'bookingTime.startTime': booking.bookingTime.startTime,
      status: 'approved'
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    booking.status = 'approved';
    await booking.save();

    // Notify the customer (optional)
    res.status(200).json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error approving booking' });
  }
});

// Decline Booking
router.put('/booking/decline/:bookingId', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.status = 'declined';
    await booking.save();

    // Notify the customer (optional)
    res.status(200).json({ message: 'Booking declined', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error declining booking' });
  }
});

module.exports = router;
