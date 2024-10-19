// /backend/models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  bookingTime: {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],  // Add 'confirmed' here
    default: 'pending'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
