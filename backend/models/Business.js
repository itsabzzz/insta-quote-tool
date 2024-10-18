// /backend/models/Business.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: String,
  price: Number,
  duration: Number, // Duration in minutes
});

const businessSchema = new mongoose.Schema({
  name: String,
  address: String,
  services: [serviceSchema], // Array of services
  pricing: {
    small: Number,
    medium: Number,
    large: Number,
    dirtySurcharge: Number
  }
}, { collection: 'business' });

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;

