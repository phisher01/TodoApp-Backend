// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: [ 'In Progress', 'Completed'],
    default: 'In Progress',
    set: function(newStatus) {
      // whenever status is changed...
      if (newStatus === 'Completed') {
        // stamp completedAt with right-now
        this.completedAt = new Date();
      } else {
        // clear it for any other status
        this.completedAt = undefined;
      }
      return newStatus;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  completedAt: {
    type: Date,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
}, {
  timestamps: false, // we're managing createdAt/completedAt ourselves
});

module.exports = mongoose.model('Task', taskSchema);
