// Vercel serverless function entry point
require('dotenv').config();

// Import Express app and the DB connect function
const app = require('../src/app');
const connectDB = require('../src/db/db');

// Cache connection status across warm invocations
let isConnected = false;

async function ensureConnection() {
  if (isConnected) return;

  try {
    await connectDB();
    isConnected = true;
    console.log('✓ MongoDB connected (cached)');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err && (err.message || String(err)));
    throw err;
  }
}

module.exports = async (req, res) => {
  try {
    await ensureConnection();
    return app(req, res);
  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? (err.message || String(err)) : 'Server error'
    });
  }
};
