// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,      // store the already‑hashed password here
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  projects: [{           // up to 4 project IDs
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
