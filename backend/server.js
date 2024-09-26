const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS to allow frontend and backend communication

// POST route to handle quotes
app.post('/get-quote', (req, res) => {
  const { size, condition } = req.body;
  
  let price;

  // Example logic for calculating price
  if (size === 'small') price = 50;
  if (size === 'medium') price = 100;
  if (size === 'large') price = 150;

  if (condition === 'very dirty') price *= 1.5;

  // Send response with the calculated price
  res.json({ price });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

  
  