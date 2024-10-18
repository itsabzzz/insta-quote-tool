// /backend/controllers/businessController.js

const axios = require('axios');
const Business = require('../models/Business');  // Import your Business model
const googleApiKey = process.env.GOOGLE_API_KEY;

// Get Google Places Autocomplete
exports.getPlaces = async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: { input, key: googleApiKey }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching address suggestions:', error.message);
    res.status(500).json({ error: 'Error fetching address suggestions' });
  }
};

// Get Quote Calculation
exports.getQuote = (req, res) => {
  const { size, condition } = req.body;
  let price = size === 'small' ? 50 : size === 'medium' ? 100 : 150;
  if (condition === 'dirty') price += 20;

  res.status(200).json({ price });
};

// Booking Submission
exports.submitBooking = (req, res) => {
  const { size, condition, time } = req.body;
  console.log(`Booking received: ${size} car, ${condition} condition, at ${time}.`);
  res.status(200).json({ message: 'Booking submitted successfully!' });
};

// Distance Calculation
exports.getDistance = async (req, res) => {
  const { customerAddress, businessId } = req.body;

  try {
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: customerAddress,
        destinations: business.address,
        key: googleApiKey,
      }
    });

    if (response.data.status === 'OK') {
      const distance = response.data.rows[0].elements[0].distance.text;
      res.json({ distance });
    } else {
      res.status(500).json({ error: 'Failed to calculate distance' });
    }
  } catch (error) {
    console.error('Error calculating distance:', error.message);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
};
