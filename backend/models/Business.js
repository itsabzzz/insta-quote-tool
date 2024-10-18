// /backend/models/Business.js
const mongoose = require('mongoose');

// /backend/models/Business.js
const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
});


const availabilitySchema = new mongoose.Schema({
  day: { type: String, required: true },  // e.g., "Monday", "Tuesday"
  startTime: { type: String, required: true },  // e.g., "09:00"
  endTime: { type: String, required: true },    // e.g., "17:00"
});


const businessSchema = new mongoose.Schema({
  name: String,
  address: String,
  services: [serviceSchema],  // Array of services
  pricing: {
    small: Number,
    medium: Number,
    large: Number,
    dirtySurcharge: Number
  },
  availability: [availabilitySchema]  // Array of availability objects
}, { collection: 'business' });


const Business = mongoose.model('Business', businessSchema);
module.exports = Business;

