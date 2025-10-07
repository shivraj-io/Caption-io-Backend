// OLD CODE (commented out for reference):
// require('dotenv').config();
// const app = require("./src/app");
// const connectDB = require("./src/db/db");

// NEW CODE - Option 1 (if db.js exports as object):
require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/db/db');

// OR NEW CODE - Option 2 (if db.js exports default):
// const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();
    console.log('✓ MongoDB connected successfully');

    // Start Express server
    const server = app.listen(PORT, HOST, () => {
      console.log(`✓ Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('✗ Server error:', err.code || err.message);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();