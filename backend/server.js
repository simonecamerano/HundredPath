// Load environment variables from .env file
require( 'dotenv' ).config();

// Import libraries
const express = require( 'express' );
const path = require( 'path' );
const cors = require( 'cors' );
const connectDB = require( './config/database' );
const authRoutes = require( './routes/auth' );
const gameRoutes = require( './routes/game' );
const userRoutes = require( './routes/users' );
const profileRoutes = require( './routes/profile' );
// Create Express app
const app = express();
// Connect to MongoDB database  
connectDB();

// ===== MIDDLEWARE =====
// CORS - Allow requests from different domains
app.use( cors( {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
} ) );
// Body Parser - Parse JSON in request body
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
// Frontend - Serve the compiled Vue app from the same origin as the API,
// so no external service delivers the pages to users and CORS is not needed.
const frontendPath = path.join( __dirname, 'public' );
app.use( express.static( frontendPath ) );
// Logger - Log requests in console (only in development)
if ( process.env.NODE_ENV === 'development' ) {
  app.use( ( req, res, next ) => {
    console.log( `${req.method} ${req.path}` );
    next(); // Pass to the next middleware
  } );
}

// ===== ROUTES =====
// Health check endpoint for deployment monitoring
app.get( '/api/health', async ( req, res ) => {
  const mongoose = require( 'mongoose' );
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json( {
    status: 'ok',
    message: 'HundredPath API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: dbStatus
  } );
} );

// API Routes
app.use( '/api/users', userRoutes );

// Auth routes
app.use( '/api/auth', authRoutes );

// Game routes
app.use( '/api/game', gameRoutes );

// Profile routes
app.use( '/api/profile', profileRoutes );

// SPA fallback - Any non-API GET request returns index.html, so Vue Router can
// handle deep links on a hard refresh. Express 5 no longer accepts app.get('*').
app.use( ( req, res, next ) => {
  if ( req.method !== 'GET' || req.path.startsWith( '/api' ) ) {
    return next();
  }
  res.sendFile( path.join( frontendPath, 'index.html' ), ( err ) => {
    if ( err ) next();
  } );
} );

// ===== ERROR HANDLING =====
// 404 - Route not found
app.use( ( req, res ) => {
  res.status( 404 ).json( {
    error: 'Route not found',
    path: req.path
  } );
} );

// Error handler - Global error handler
app.use( ( err, req, res, next ) => {
  console.error( 'Error:', err.message );

  res.status( err.status || 500 ).json( {
    error: err.message || 'Internal server error'
  } );
} );


// =====  SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen( PORT, () => {
  console.log( '🚀 ====================================' );
  console.log( `🚀 Server HundredPath started!` );
  console.log( `🚀 Port: ${PORT}` );
  console.log( `🚀 Environment: ${process.env.NODE_ENV}` );
  console.log( `🚀 URL: http://localhost:${PORT}` );
  console.log( '🚀 ====================================' );
} );