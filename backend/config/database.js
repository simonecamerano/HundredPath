/**
 * MongoDB Configuration
 * 
 * This file handles the connection to the database using Mongoose
 */
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    // MongoDB connection
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process if connection fails
  }
};
// Connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');     
});
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Error: ${err.message}`);
});
module.exports = connectDB;