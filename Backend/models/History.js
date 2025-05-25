const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  action: { type: String, enum: ['Created', 'Updated', 'Analyzed'], default: 'Analyzed' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);