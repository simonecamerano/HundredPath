// Load environment variables from .env file
require('dotenv').config();

// Import libraries
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
// Create Express app
const app = express();
// Connect to MongoDB database  
connectDB();

// ===== MIDDLEWARE =====
// CORS - Allow requests from different domains
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
// Body Parser - Parse JSON in request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logger - Log requests in console (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next(); // Pass to the next middleware
});
}

// ===== ROUTES =====
// Health check - Route to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'HundredPath API is running',
    timestamp: new Date().toISOString()
  });
});
// Route to test - Respond with a simple message
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to HundredPath API!',
    version: '1.0.0'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// ===== ERROR HANDLING =====
// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});
// Error handler - Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});


// =====  SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 ====================================');
  console.log(`🚀 Server HundredPath started!`);    
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log('🚀 ====================================');
});