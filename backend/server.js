const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
