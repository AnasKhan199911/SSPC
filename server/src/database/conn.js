const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/sspc'; // Hardcoded connection string

async function connect() {
  try {
    await mongoose.connect(DB_URI, {
    });
    console.log('Database Successfully Connected');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    // Handle the error properly, e.g., throw an exception
    throw error;
  }
}

export default connect;


