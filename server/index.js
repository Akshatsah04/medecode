require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/report', reportRoutes);

app.get('/', (req, res) => {
  res.send('MediExplain Backend is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Only images and PDF files are allowed!') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Processing failed' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
