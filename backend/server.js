const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const axios = require('axios');


// Define specific CORS options if needed
const corsOptions = {
  origin: '*', // For development: allow all origins. Change to specific domains in production.
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(express.json()); // To parse JSON bodies
app.use(cors(corsOptions)); // Enable CORS with specific options

// POST route to handle quotes
app.post('/get-quote', (req, res) => {
  const { size, condition } = req.body;
  let price = 0;

  // Example logic for calculating price
  if (size === 'small') price = 50;
  if (size === 'medium') price = 100;
  if (size === 'large') price = 150;

  if (condition === 'dirty') price += 20;

  res.status(200).json({ price }); // Send back JSON response
});

app.post('/submit-booking', (req, res) => {
  const { size, condition, time } = req.body;

  // For simplicity, let's log the booking to the console or save it to a database (this will be part of the future feature)
  console.log(`Booking received: ${size} car, ${condition} condition, at ${time}.`);
  
  // Respond with a success message
  res.status(200).json({ message: 'Booking submitted successfully!' });
});


// Add the route to get a distance-based quote
app.post('/get-distance-quote', async (req, res) => {
  const { businessAddress, customerAddress, baseQuote } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY; // Store this securely

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: businessAddress,
        destinations: customerAddress,
        key: apiKey
      }
    });

    const distanceInKm = response.data.rows[0].elements[0].distance.value / 1000;
    const travelCost = distanceInKm * 0.5; // Example rate per km
    const finalQuote = baseQuote + travelCost;

    res.json({ quote: finalQuote, distance: distanceInKm });

  } catch (error) {
    console.error('Error fetching distance:', error);
    res.status(500).json({ message: 'Error calculating distance' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
