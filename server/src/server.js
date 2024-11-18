const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router/routes');

// Use the centralized router file

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sspc', {
  
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

  // Middleware
  app.use(cors({
    origin: 'http:// 192.168.81.1:5000', // Allow all origins or specify your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'application/json','Authorization'],
  }));
  
// Routes
app.use('/api',router);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the portal' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
