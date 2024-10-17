const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;


// Database Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB 🔥'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Business Schema and Model
const businessSchema = new mongoose.Schema({
  name: String,
  address: String,
  services: [String],
  pricing: {
    small: Number,
    medium: Number,
    large: Number,
    dirtySurcharge: Number
  }
}, { collection: 'business' });

const Business = mongoose.model('Business', businessSchema);

// CORS Options
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

const googleApiKey = process.env.GOOGLE_API_KEY;

// Google Places Autocomplete
app.get('/api/places', async (req, res) => {
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
});

// Quote Calculation Endpoint
app.post('/get-quote', (req, res) => {
  const { size, condition } = req.body;
  let price = size === 'small' ? 50 : size === 'medium' ? 100 : 150;
  if (condition === 'dirty') price += 20;

  res.status(200).json({ price });
});

// Booking Submission Endpoint
app.post('/submit-booking', (req, res) => {
  const { size, condition, time } = req.body;
  console.log(`Booking received: ${size} car, ${condition} condition, at ${time}.`);
  res.status(200).json({ message: 'Booking submitted successfully!' });
});

// Distance Calculation Endpoint
app.post('/get-distance', async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
