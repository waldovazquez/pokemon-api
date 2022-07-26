const Mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
  try {
    await Mongoose.connect(process.env.DATABASE || 'mongodb://localhost:27017/pokemon-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.info('MongoDB Connected');
  } catch (e) {
    console.info('Error', e);
  }
}

module.exports = connectDB;
