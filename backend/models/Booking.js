const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service: String,
  price: Number,
  time: Date,
  status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
