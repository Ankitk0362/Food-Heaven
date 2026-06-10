'use strict';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const reservationRoutes = require('./routes/reservationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tastehaven';

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*'
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/reservations', reservationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server error'
  });
});

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Falling back to local MongoDB at:', MONGO_URI);
  }

  await mongoose.connect(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Taste Haven backend running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error(err.message);
  process.exit(1);
});
