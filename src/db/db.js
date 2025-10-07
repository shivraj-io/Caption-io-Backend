const mongoose = require('mongoose');

// OLD CODE (commented out for reference):
// async function connectDB() {
//   const uri = process.env.MONGODB_URL || process.env.MONGO_URL || process.env.MONGODB_URI;
//   if (!uri) throw new Error('MONGODB_URL is not set');
//   mongoose.set('strictQuery', true);
//   try {
//     await mongoose.connect(uri);
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     throw err;
//   }
// }
// module.exports = connectDB;

// NEW CODE (production-level):
async function connectDB() {
  const uri = process.env.MONGODB_URL || process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URL is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected to:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }

  // Handle connection events
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}

// Ensure proper export
module.exports = connectDB;
module.exports.connectDB = connectDB;