const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initializeSocket } = require('./utils/socket');
const { generateDailyAnalytics } = require('./controllers/analyticsController');
const http = require('http');
const path = require('path');
const cron = require('node-cron');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reviews', require('./routes/reviews'));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Service Booking API' });
});

// Schedule daily analytics generation (runs at midnight every day)
cron.schedule('0 0 * * *', async () => {
  try {
    await generateDailyAnalytics();
    console.log('Daily analytics generated successfully');
  } catch (error) {
    console.error('Error generating daily analytics:', error);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});