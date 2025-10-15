const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Restrict CORS to the frontend origin by default (set FRONTEND_URL in .env for production)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_URL }));

// Limit JSON body size to avoid large payload abuse
app.use(express.json({ limit: '1mb' }));

// Serve uploaded files from absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic security headers (small subset of what helmet provides)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  // Cross-Origin-Resource-Policy helps mitigate some mixed-content/resource attacks
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'thunder_road'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('\u2705 Connected to MySQL database');
});

// Make db available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // keep original extension, but generate a safe filename
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${path.extname(file.originalname)}`;
    cb(null, safeName);
  }
});

// Limit uploads to 5MB and allow only common image/video types
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    const err = new Error('Invalid file type');
    err.status = 400;
    return cb(err);
  }
});
app.set('upload', upload);

// Import Routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const reservationRoutes = require('./routes/reservations');
const jobRoutes = require('./routes/jobs');
const mediaRoutes = require('./routes/media');
const settingsRoutes = require('./routes/settings');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

// Use Routes
app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', reservationRoutes);
app.use('/api', jobRoutes);
app.use('/api', mediaRoutes);
app.use('/api', settingsRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', contactRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Thunder Road API is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\ud83d\ude80 Server running on http://localhost:${PORT}`);
});
