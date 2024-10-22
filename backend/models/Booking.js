// /models/Booking.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  bookingTime: {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }, // New field
  customerEmail: { type: String },  // To notify the customer
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
