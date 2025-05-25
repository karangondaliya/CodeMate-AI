const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['Backend', 'Frontend', 'AI Engineer', 'Product Manager', 'Normal'], required: true },
  githubUrl: { type: String, required: true },
  diagrams: [{ type: String }],        //  ['ClassDiagram', 'SequenceDiagram', 'Flowchart']
  summary: { type: String },
  diagramImages: [{ type: String }],  // base64 means byte array
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);