require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'WhatsApp Chat & Conversation System',
    status: 'running',
    version: '1.0.0',
    features: [
      'JWT auth',
      'Admin and user roles',
      'MongoDB conversation storage',
      'Meta WhatsApp Cloud API integration',
      'Webhook processing',
    ],
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const startServer = async () => {
  const dbConnected = await connectDB();
  if (!dbConnected) {
    console.warn('Continuing without database connection. Some endpoints may fail until MongoDB is available.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
