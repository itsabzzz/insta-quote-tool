// /backend/models/Business.js
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  services: [String],
  pricing: {
    small: Number,
    medium: Number,
    large: Number,
    dirtySurcharge: Number,
    costPerMile: Number
  }
});

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
