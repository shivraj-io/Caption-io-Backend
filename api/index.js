// Vercel serverless function entry point
require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/db/db');

// Connect to MongoDB (connection will be reused across function invocations)
let isConnected = false;

async function ensureConnection() {
  if (isConnected) {
    return;
  }
  
  try {
    await connectDB();
    isConnected = true;
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    throw err;
  }
}

// Export the Express app as a serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database connection
    await ensureConnection();
    
    // Pass request to Express app
    return app(req, res);
  } catch (err) {
    console.error('Function error:', err);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
  }
};
