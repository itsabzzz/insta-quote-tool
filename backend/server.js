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
app.post('/get-distance', async (req, res) => {
  const { address } = req.body;
  const businessAddress = '28 Greenside Chase, Bury, BL9 9EG'; // Replace with actual business address
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(address)}&destinations=${encodeURIComponent(businessAddress)}&key=AIzaSyBCc4wVHYXW7jzHKniRDNWl45o0JsePWIE`);
    const data = await response.json();
    const distance = data.rows[0].elements[0].distance.text;
    
    res.json({ distance });
  } catch (error) {
    console.error('Error calculating distance:', error);
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

