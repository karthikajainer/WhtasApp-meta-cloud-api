const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/whatsapp_chat';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
    return false;
  }
};

module.exports = { connectDB };
