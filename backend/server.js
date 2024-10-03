const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS to allow frontend and backend communication

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

// POST route to handle bookings
app.post('/submit-booking', (req, res) => {
  const { size, condition, time } = req.body;
  console.log(`Booking received: ${size} car, ${condition} condition, at ${time}.`);
  res.status(200).json({ message: 'Booking submitted successfully!' });
});

// GET route to fetch all bookings (for dashboard management)
app.get('/api/bookings', (req, res) => {
  // Mock data - eventually, this will pull from a database
  const bookings = [
    { id: 1, customer: 'John Doe', service: 'Car Detailing', time: '2024-10-05 10:00' },
    { id: 2, customer: 'Jane Smith', service: 'Car Detailing', time: '2024-10-05 14:00' }
  ];
  res.status(200).json(bookings);
});

// POST route to update pricing (for dashboard)
app.post('/api/update-pricing', (req, res) => {
  const { service, newPrice } = req.body;
  // Logic to update price in database or in-memory storage
  console.log(`Price for ${service} updated to ${newPrice}`);
  res.status(200).json({ message: `Price for ${service} updated to ${newPrice}` });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
