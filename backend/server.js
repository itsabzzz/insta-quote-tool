const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 5000;

// CORS options
const corsOptions = {
  origin: '*', // Adjust this to specific origins for production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

const googleApiKey = 'AIzaSyBCc4wVHYXW7jzHKniRDNWl45o0JsePWIE';

// Proxy endpoint for Google Places autocomplete
app.get('/api/places', async (req, res) => {
  const { input } = req.query;

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input,
        key: googleApiKey,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching address suggestions:', error.message);
    res.status(500).json({ error: 'Error fetching address suggestions' });
  }
});

// Endpoint for calculating quote based on car size and condition
app.post('/get-quote', (req, res) => {
  const { size, condition } = req.body;
  let price = 0;

  if (size === 'small') price = 50;
  if (size === 'medium') price = 100;
  if (size === 'large') price = 150;

  if (condition === 'dirty') price += 20;

  res.status(200).json({ price });
});

// Booking submission endpoint
app.post('/submit-booking', (req, res) => {
  const { size, condition, time } = req.body;

  console.log(`Booking received: ${size} car, ${condition} condition, at ${time}.`);
  res.status(200).json({ message: 'Booking submitted successfully!' });
});

// Calculate distance and return it
app.post('/get-distance', async (req, res) => {
  const { address } = req.body;
  const businessAddress = '28 Greenside Chase, Bury, BL9 9EG';

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: address,
        destinations: businessAddress,
        key: googleApiKey,
      },
    });
    const distance = response.data.rows[0].elements[0].distance.text;
    res.json({ distance });
  } catch (error) {
    console.error('Error calculating distance:', error.message);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
