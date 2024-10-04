const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();  // Import SQLite
const app = express();
const port = 5000;

// Initialize SQLite database
const db = new sqlite3.Database('./car_detailing.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    size TEXT,
    condition TEXT,
    time TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    time TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pricing (
    service TEXT PRIMARY KEY,
    price INTEGER
  )`);

  // Insert default pricing if none exists
  db.run(`INSERT OR IGNORE INTO pricing (service, price) VALUES 
    ('small', 50), 
    ('medium', 100), 
    ('large', 150)`);
});

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS to allow frontend and backend communication

// POST route to handle quotes
app.post('/get-quote', (req, res) => {
  const { size, condition } = req.body;
  
  db.get(`SELECT price FROM pricing WHERE service = ?`, [size], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching price' });
    } else {
      let price = row.price;
      if (condition === 'dirty') price += 20;
      res.status(200).json({ price });
    }
  });
});

// POST route to handle bookings
app.post('/submit-booking', (req, res) => {
  const { size, condition, time } = req.body;
  
  const sql = `INSERT INTO bookings (size, condition, time) VALUES (?, ?, ?)`;
  db.run(sql, [size, condition, time], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error saving booking' });
    } else {
      res.status(200).json({ message: 'Booking submitted successfully!' });
    }
  });
});

// GET route to fetch all bookings (for dashboard management)
app.get('/api/bookings', (req, res) => {
  const sql = `SELECT * FROM bookings`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching bookings' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// POST route to update pricing (for dashboard)
app.post('/api/update-pricing', (req, res) => {
  const { smallPrice, mediumPrice, largePrice } = req.body;

  const updateSmall = `UPDATE pricing SET price = ? WHERE service = 'small'`;
  const updateMedium = `UPDATE pricing SET price = ? WHERE service = 'medium'`;
  const updateLarge = `UPDATE pricing SET price = ? WHERE service = 'large'`;

  db.run(updateSmall, [smallPrice], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating small price' });
  });
  db.run(updateMedium, [mediumPrice], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating medium price' });
  });
  db.run(updateLarge, [largePrice], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating large price' });

    res.status(200).json({ message: 'Pricing updated successfully' });
  });
});

// POST route to update availability
app.post('/update-availability', (req, res) => {
  const { date, time } = req.body;

  const sql = `INSERT INTO availability (date, time) VALUES (?, ?)`;
  db.run(sql, [date, time], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error updating availability' });
    } else {
      res.status(200).json({ message: 'Availability updated successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
