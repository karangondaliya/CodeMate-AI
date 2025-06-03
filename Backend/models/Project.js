const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Backend', 'Frontend', 'AI Engineer', 'Product Manager', 'Normal'], 
    required: true 
  },
  githubUrl: { 
    type: String, 
    required: true 
  },
  // Store diagram names/types
  diagrams: [{ 
    type: String 
  }],
  // Store the actual mermaid diagram codes
  diagramCodes: [{ 
    type: String 
  }],
  // Store summary data
  summary: { 
    type: String 
  },
  // Store base64 encoded diagram images
  diagramImages: [{ 
    type: String 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add indexes for better query performance
ProjectSchema.index({ user: 1, createdAt: -1 });
ProjectSchema.index({ githubUrl: 1 });

module.exports = mongoose.model('Project', ProjectSchema);