const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();  // Import SQLite
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



// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    size TEXT,
    condition TEXT,
    time TEXT,
    customer_email TEXT   
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

// Modify POST route to handle quotes with business_id
app.post('/get-quote', (req, res) => {
  const { size, condition, businessId } = req.body;
  
  const sql = `SELECT price FROM pricing WHERE service = ? AND business_id = ?`;
  db.get(sql, [size, businessId], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching price' });
    } else {
      let price = row.price;
      if (condition === 'dirty') price += 20;
      res.status(200).json({ price });
    }
  });
});

// Modify POST route to submit bookings with business_id
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
          user: process.env.EMAIL_USER, // Should be set in Railway environment
          pass: process.env.EMAIL_PASS  // Should be set in Railway environment
        }
      });

      const mailOptions = {
        from: 'your-email@gmail.com',   // Replace with your email
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
          console.error('Error sending email:', error);
          res.status(500).json({ message: 'Error sending email' });
        } else {
          console.log('Email sent successfully:', info.response);
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
    res.status(200).json(rows);  // Ensure an array of bookings is returned
  });
});



// POST route to update pricing (for dashboard)
app.post('/update-availability', (req, res) => {
  const { date, time, businessId } = req.body;
  if (!date || !time || !businessId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `INSERT INTO availability (date, time, business_id) VALUES (?, ?, ?)`;
  db.run(sql, [date, time, businessId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating availability' });
    }
    res.status(200).json({ message: 'Availability updated successfully' });
  });
});


app.post('/api/update-pricing', (req, res) => {
  const { smallPrice, mediumPrice, largePrice, businessId } = req.body;

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


// Get a customer's bookings based on email
app.get('/api/customer-bookings/:email', (req, res) => {
  const email = req.params.email;

  // Query database for bookings based on customer's email
  const sql = `SELECT * FROM bookings WHERE customer_email = ?`;
  db.all(sql, [email], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching customer bookings' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// POST route to handle canceling a booking
app.post('/cancel', (req, res) => {
  const { bookingId } = req.body;

  const sql = `DELETE FROM bookings WHERE id = ?`;
  db.run(sql, [bookingId], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error canceling booking' });
    } else {
      res.status(200).json({ message: 'Booking canceled successfully!' });
    }
  });
});

// POST route to handle rescheduling a booking
app.post('/reschedule', (req, res) => {
  const { bookingId, newTime } = req.body;
  
  const sql = `UPDATE bookings SET time = ? WHERE id = ?`;
  db.run(sql, [newTime, bookingId], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error rescheduling booking' });
    } else {
      res.status(200).json({ message: 'Booking rescheduled successfully!' });
    }
  });
});

// GET route to show a cancel confirmation page
app.get('/cancel', (req, res) => {
  const bookingId = req.query.bookingId;
  // Display confirmation page (could be HTML)
  res.send(`
    <h1>Are you sure you want to cancel booking #${bookingId}?</h1>
    <form action="/confirm-cancel" method="POST">
      <input type="hidden" name="bookingId" value="${bookingId}" />
      <button type="submit">Yes, Cancel</button>
    </form>
  `);
});

// POST route to handle canceling a booking after confirmation
app.post('/confirm-cancel', (req, res) => {
  const { bookingId } = req.body;

  const sql = `DELETE FROM bookings WHERE id = ?`;
  db.run(sql, [bookingId], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error canceling booking' });
    } else {
      res.status(200).json({ message: 'Booking canceled successfully!' });
    }
  });
});

// GET route to show a reschedule confirmation page
app.get('/reschedule', (req, res) => {
  const bookingId = req.query.bookingId;
  // Display rescheduling form (could be HTML)
  res.send(`
    <h1>Reschedule booking #${bookingId}</h1>
    <form action="/confirm-reschedule" method="POST">
      <input type="hidden" name="bookingId" value="${bookingId}" />
      <label for="newTime">Select New Time:</label>
      <input type="datetime-local" name="newTime" />
      <button type="submit">Confirm Reschedule</button>
    </form>
  `);
});

// POST route to handle rescheduling a booking after confirmation
app.post('/confirm-reschedule', (req, res) => {
  const { bookingId, newTime } = req.body;

  const sql = `UPDATE bookings SET time = ? WHERE id = ?`;
  db.run(sql, [newTime, bookingId], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error rescheduling booking' });
    } else {
      res.status(200).json({ message: 'Booking rescheduled successfully!' });
    }
  });
});

// Create an owners table to store business credentials
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS owners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER,
    email TEXT,
    password TEXT -- In the future, you should hash passwords
  )`);
});

// POST route to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.EMAIL_USER && password === process.env.EMAIL_PASS) {
    res.status(200).json({ business_id: 1 }); // Example business ID
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.post('/api/update-business-settings', (req, res) => {
  const { businessId, businessName, serviceNames } = req.body;

  // Update business settings in the database
  const updateBusiness = `UPDATE businesses SET name = ?, services = ? WHERE id = ?`;
  db.run(updateBusiness, [businessName, serviceNames.join(', '), businessId], function(err) {
    if (err) {
      res.status(500).json({ message: 'Error updating business settings' });
    } else {
      res.status(200).json({ message: 'Business settings updated successfully' });
    }
  });
});

