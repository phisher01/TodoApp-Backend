// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  description:{ type: String, trim: true, default: '' },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ▶️ NEW counter fields
  pendingTasks:   { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
