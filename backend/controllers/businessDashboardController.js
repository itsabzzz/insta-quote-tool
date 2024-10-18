// /backend/controllers/businessDashboardController.js
const Booking = require('../models/Booking'); // Assuming you have a Booking model


// Create Test Booking (Temporary)
//exports.createTestBooking = async (req, res) => {
//    const { businessId, customerId, service, price, time } = req.body;
//  
//    try {
//      const newBooking = new Booking({
//        businessId,
//        customerId,
//        service,
//        price,
//        time,
//        status: 'pending'
//      });
//  
//      await newBooking.save();
//      res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
//    } catch (error) {
//      console.error('Error creating booking:', error);
//      res.status(500).json({ error: 'Error creating booking' });
//    }
//  };


// Reschedule Booking
exports.rescheduleBooking = async (req, res) => {
  const { bookingId, newTime } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Update the booking with new time
    booking.time = newTime;
    await booking.save();

    res.status(200).json({ message: 'Booking rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    res.status(500).json({ error: 'Error rescheduling booking' });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Error canceling booking' });
  }
};
