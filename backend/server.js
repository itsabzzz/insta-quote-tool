const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 5001;
const saltRounds = 10;

// Initialize SQLite database
const db = new sqlite3.Database('./car_detailing.db', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// CORS Setup
app.use(cors({
  origin: 'https://itsabzzz.github.io', // Restrict to your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors()); // Enable preflight for all routes

app.use(express.json()); // For parsing application/json

// Routes for your application
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  db.run(`INSERT INTO businesses (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function(err) {
    if (err) {
      console.error('Registration error:', err.message);
      return res.status(500).json({ message: 'Registration failed' });
    }
    res.status(201).json({ message: 'Business registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM businesses WHERE email = ?`, [email], (err, business) => {
    if (err || !business || !bcrypt.compareSync(password, business.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ business_id: business.id });
  });
});

app.post('/get-quote', (req, res) => {
  const { size, condition, businessId } = req.body;
  
  db.get(`SELECT price FROM pricing WHERE service = ? AND business_id = ?`, [size, businessId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error fetching price' });
    let price = row ? row.price : 0;
    if (condition === 'dirty') price += 20;
    res.status(200).json({ price });
  });
});

app.post('/submit-booking', (req, res) => {
  const { size, condition, time, email, businessId } = req.body;
  
  db.run(`INSERT INTO bookings (size, condition, time, customer_email, business_id) VALUES (?, ?, ?, ?, ?)`, [size, condition, time, email, businessId], function(err) {
    if (err) return res.status(500).json({ message: 'Error saving booking' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const customerMailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Booking Confirmation',
      html: `<h1>Booking Confirmation</h1><p>Car Size: ${size}</p><p>Condition: ${condition}</p><p>Time: ${time}</p>`
    };

    transporter.sendMail(customerMailOptions, (error, info) => {
      if (error) console.error('Error sending customer email:', error);
    });

    res.status(200).json({ message: 'Booking submitted successfully!' });
  });
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

  db.run(`CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pricing (
    service TEXT,
    price INTEGER,
    business_id INTEGER,
    PRIMARY KEY(service, business_id)
  )`);

  // Insert default pricing if none exists
  db.run(`INSERT OR IGNORE INTO pricing (service, price, business_id) VALUES 
    ('small', 50, 1), 
    ('medium', 100, 1), 
    ('large', 150, 1)`);
});

// Sample POST route
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


app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});