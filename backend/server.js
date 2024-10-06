const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();  
const app = express();
const port = 5000;
const nodemailer = require('nodemailer');

// Initialize SQLite database
const db = new sqlite3.Database('./car_detailing.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create tables if they don't exist, including business_id column
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    size TEXT,
    condition TEXT,
    time TEXT,
    customer_email TEXT,
    business_id INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    time TEXT,
    business_id INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pricing (
    service TEXT PRIMARY KEY,
    price INTEGER,
    business_id INTEGER
  )`);

  // Insert default pricing if none exists
  db.run(`INSERT OR IGNORE INTO pricing (service, price, business_id) VALUES 
    ('small', 50, 1), 
    ('medium', 100, 1), 
    ('large', 150, 1)`);
});

app.use(express.json()); // To parse JSON bodies
app.use(cors()); // Enable CORS

// POST route to handle quotes with business_id
app.post('/get-quote', (req, res) => {
  const { size, condition, businessId } = req.body;
  
  const sql = `SELECT price FROM pricing WHERE service = ? AND business_id = ?`;
  db.get(sql, [size, businessId], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching price' });
    } else {
      let price = row ? row.price : 0;
      if (condition === 'dirty') price += 20;
      res.status(200).json({ price });
    }
  });
});

// POST route to submit bookings with business_id
app.post('/submit-booking', (req, res) => {
  const { size, condition, time, email, businessId } = req.body;
  
  const sql = `INSERT INTO bookings (size, condition, time, customer_email, business_id) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [size, condition, time, email, businessId], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error saving booking' });
    } else {
      const bookingId = this.lastID;

      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: 'your-email@gmail.com',  
        to: email,
        subject: 'Booking Confirmation',
        html: `
          <h1>Booking Confirmation</h1>
          <p>Car Size: ${size}</p>
          <p>Condition: ${condition}</p>
          <p>Time: ${time}</p>
          <p><a href="https://insta-quote-tool-production.up.railway.app/reschedule?bookingId=${bookingId}">Reschedule</a> | <a href="https://insta-quote-tool-production.up.railway.app/cancel?bookingId=${bookingId}">Cancel</a></p>
        `
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).json({ message: 'Error sending email' });
        } else {
          res.status(200).json({ message: 'Booking submitted successfully!' });
        }
      });
    }
  });
});

// Get bookings based on business_id
app.get('/api/bookings', (req, res) => {
  const businessId = req.query.businessId;
  const sql = `SELECT * FROM bookings WHERE business_id = ?`;
  db.all(sql, [businessId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching bookings' });
    }
    res.status(200).json(rows);
  });
});

// POST route to update availability (for dashboard)
app.post('/update-availability', (req, res) => {
  const { date, time, businessId } = req.body;

  if (!date || !time || !businessId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `INSERT INTO availability (date, time, business_id) VALUES (?, ?, ?)`;
  db.run(sql, [date, time, businessId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating availability' });
    }
    res.status(200).json({ message: 'Availability updated successfully' });
  });
});

// POST route to update pricing (for dashboard)
app.post('/api/update-pricing', (req, res) => {
  const { smallPrice, mediumPrice, largePrice, businessId } = req.body;

  if (!smallPrice || !mediumPrice || !largePrice || !businessId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const updateSmall = `UPDATE pricing SET price = ? WHERE service = 'small' AND business_id = ?`;
  const updateMedium = `UPDATE pricing SET price = ? WHERE service = 'medium' AND business_id = ?`;
  const updateLarge = `UPDATE pricing SET price = ? WHERE service = 'large' AND business_id = ?`;

  db.run(updateSmall, [smallPrice, businessId], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating small price' });
  });
  db.run(updateMedium, [mediumPrice, businessId], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating medium price' });
  });
  db.run(updateLarge, [largePrice, businessId], (err) => {
    if (err) return res.status(500).json({ message: 'Error updating large price' });

    res.status(200).json({ message: 'Pricing updated successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
