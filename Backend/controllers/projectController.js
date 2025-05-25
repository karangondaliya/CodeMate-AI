const axios = require('axios');
require('dotenv').config();
const Project = require('../models/Project');

// All available diagram types
const ALL_DIAGRAM_TYPES = [
  "Class Diagram", 
  "Sequence Diagram", 
  "ER Diagram", 
  "Use Case Diagram", 
];

exports.createProject = async (req, res) => {
  try {
    const { githubUrl, role, requested_diagrams = [], branch } = req.body;

    // Validate input
    if (!githubUrl.startsWith('https://github.com/')) {
      return res.status(400).json({ message: 'Invalid GitHub URL' });
    }
    
    // Use all diagram types regardless of what was requested
    const allDiagrams = ALL_DIAGRAM_TYPES;

    const summarizeUrl = 'http://localhost:8000/summarize';
    const diagramUrl = 'http://localhost:8000/generate-diagrams';

    const [summaryResponse, diagramResponse] = await Promise.all([
      axios.post(summarizeUrl, { repo_url: githubUrl, branch }),
      axios.post(diagramUrl, { 
        repo_url: githubUrl, 
        branch, 
        role, 
        requested_diagrams: allDiagrams // Use ALL diagram types
      })
    ]);
    
    console.log('Summary Response:', summaryResponse.data);
    console.log('Diagram Response:', diagramResponse.data);

    // Check if the responses have the expected structure
    if (!summaryResponse.data.summary) {
      throw new Error('Invalid or missing summary data from FastAPI');
    }
    
    if (!diagramResponse.data.diagrams) {
      throw new Error('Invalid or missing diagram data from FastAPI');
    }
    
    const summaryData = summaryResponse.data.summary;
    const summary = typeof summaryData === 'string' 
                    ? summaryData 
                    : JSON.stringify(summaryData);
    
    const diagramsData = diagramResponse.data.diagrams;
    
    // Extract just the diagram code values as an array of strings
    const diagramCodesArray = Object.values(diagramsData).map(code => 
      typeof code === 'string' ? code : JSON.stringify(code)
    );

    // Check if we're missing any requested diagrams
    const receivedDiagramNames = Object.keys(diagramsData);
    const missingDiagrams = allDiagrams.filter(d => !receivedDiagramNames.includes(d));
    
    if (missingDiagrams.length > 0) {
      // console.warn(Some requested diagrams were not generated: ${missingDiagrams.join(', ')});
    }

    // Create the project with properly formatted data
    const project = await Project.create({
      user: req.user.id,
      role, // Use the role directly as provided
      githubUrl,
      diagrams: allDiagrams, // Store ALL diagram types
      summary,
      diagramCodes: diagramCodesArray // Array of diagram code strings
    });

    res.status(201).json({
      message: 'Project analysis complete',
      project
    });

  } catch (error) {
    console.error('Project creation error:', error);
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      message: 'Project analysis failed',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { details: error.response?.data })
    });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 }); //-1 is for recent project
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project history', error });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id 
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the project', error });
  }
};