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

    console.log('Making API calls to FastAPI...');

    const [summaryResponse, diagramResponse] = await Promise.all([
      axios.post(summarizeUrl, { repo_url: githubUrl, branch }),
      axios.post(diagramUrl, { 
        repo_url: githubUrl, 
        branch, 
        role, 
        requested_diagrams: allDiagrams
      })
    ]);
    
    console.log('Summary Response received:', !!summaryResponse.data.summary);
    console.log('Diagram Response received:', !!diagramResponse.data.success);

    // Validate summary response
    if (!summaryResponse.data || !summaryResponse.data.summary) {
      throw new Error('Invalid or missing summary data from FastAPI');
    }
    
    // Validate diagram response
    if (!diagramResponse.data || !diagramResponse.data.success || !diagramResponse.data.diagrams) {
      console.error('Diagram response structure:', diagramResponse.data);
      throw new Error('Invalid or missing diagram data from FastAPI');
    }
    
    // Process summary data
    const summaryData = summaryResponse.data.summary;
    const summary = typeof summaryData === 'string' 
                    ? summaryData 
                    : JSON.stringify(summaryData);
    
    // Process diagram data with enhanced validation
    const diagramsData = diagramResponse.data.diagrams;
    let validDiagrams = [];
    let validDiagramCodes = [];
    
    if (typeof diagramsData === 'object' && diagramsData !== null) {
      console.log('🔍 Processing and validating diagrams...');
      
      for (const [diagramName, diagramCode] of Object.entries(diagramsData)) {
        try {
          if (typeof diagramCode === 'string' && diagramCode.trim().length > 0) {
            // Clean the diagram code by removing markdown backticks
            let cleanedCode = diagramCode
              .replace(/```mermaid\n?/g, '')  // Remove opening ```mermaid
              .replace(/```\n?$/g, '')        // Remove closing ```
              .trim();                        // Remove extra whitespace
            
            // Additional validation - check if it's not an error message
            if (!cleanedCode.toLowerCase().includes('error generating') && 
                !cleanedCode.toLowerCase().includes('error:') &&
                cleanedCode.length > 20) { // Minimum length check
              
              // Basic Mermaid syntax validation
              const isValidMermaid = validateBasicMermaidSyntax(cleanedCode);
              
              if (isValidMermaid) {
                validDiagrams.push(diagramName);
                validDiagramCodes.push(cleanedCode);
                console.log(`✅ ${diagramName}: Valid diagram (${cleanedCode.length} chars)`);
              } else {
                console.log(`⚠️ ${diagramName}: Invalid Mermaid syntax, but including anyway`);
                // Include anyway as the Python validation should have corrected it
                validDiagrams.push(diagramName);
                validDiagramCodes.push(cleanedCode);
              }
            } else {
              console.log(`❌ ${diagramName}: Invalid or error diagram code`);
            }
          } else {
            console.log(`❌ ${diagramName}: Empty or invalid diagram code`);
          }
        } catch (validationError) {
          console.error(`❌ Error validating ${diagramName}:`, validationError.message);
        }
      }
    }
    
    console.log('📊 Validation complete:', {
      totalDiagrams: Object.keys(diagramsData || {}).length,
      validDiagrams: validDiagrams.length,
      diagramNames: validDiagrams,
      summaryLength: summary.length
    });

    // Ensure we have at least some valid data
    if (!summary && validDiagramCodes.length === 0) {
      throw new Error('No valid diagrams or summary generated from the repository');
    }

    // Log sample diagram for debugging
    if (validDiagramCodes.length > 0) {
      console.log('📋 Sample diagram preview:', {
        name: validDiagrams[0],
        codePreview: validDiagramCodes[0].substring(0, 150) + '...',
        totalLength: validDiagramCodes[0].length
      });
    }

    // Create the project with only validated diagram data
    const projectData = {
      user: req.user.id,
      role,
      githubUrl,
      diagrams: validDiagrams,              // Only valid diagram names
      diagramCodes: validDiagramCodes,      // Only valid diagram codes
      summary,
      diagramImages: [] // Initialize empty, will be populated later if needed
    };

    console.log('💾 Creating project with validated data:', {
      user: projectData.user,
      role: projectData.role,
      githubUrl: projectData.githubUrl,
      validDiagramsCount: projectData.diagrams.length,
      validDiagramCodesCount: projectData.diagramCodes.length,
      hasSummary: !!projectData.summary
    });

    const project = await Project.create(projectData);

    console.log('✅ Project created successfully with ID:', project._id);

    // Verify the data was stored correctly
    const savedProject = await Project.findById(project._id).lean();
    console.log('🔍 Storage verification:', {
      savedDiagramNames: savedProject.diagrams,
      savedDiagramCodesCount: savedProject.diagramCodes?.length,
      hasSummary: !!savedProject.summary,
      firstDiagramPreview: savedProject.diagramCodes?.[0]?.substring(0, 100) + '...'
    });

    // Return success response with validation info
    res.status(201).json({
      message: 'Project analysis complete with validated diagrams',
      project: {
        id: project._id,
        user: project.user,
        role: project.role,
        githubUrl: project.githubUrl,
        diagrams: project.diagrams,
        diagramCodesCount: project.diagramCodes.length,
        summary: project.summary ? 'Generated' : 'Not generated',
        createdAt: project.createdAt
      },
      validation: {
        totalDiagramsReceived: Object.keys(diagramsData || {}).length,
        validDiagramsStored: validDiagrams.length,
        validDiagramNames: validDiagrams
      }
    });

  } catch (error) {
    console.error('❌ Project creation error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Log FastAPI specific errors
    if (error.response) {
      console.error('FastAPI Error Response:', error.response.data);
      console.error('FastAPI Error Status:', error.response.status);
    }
    
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      message: 'Project analysis failed',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.response?.data,
        stack: error.stack 
      })
    });
  }
};

// Helper function for basic Mermaid syntax validation
function validateBasicMermaidSyntax(mermaidCode) {
  try {
    const code = mermaidCode.trim();
    
    if (!code) return false;
    
    // Check for valid diagram type declarations
    const validDiagramTypes = [
      'classDiagram',
      'sequenceDiagram', 
      'erDiagram',
      'graph TD', 'graph TB', 'graph LR', 'graph RL',
      'flowchart TD', 'flowchart TB', 'flowchart LR', 'flowchart RL'
    ];
    
    const hasValidType = validDiagramTypes.some(type => 
      code.startsWith(type) || code.includes(type)
    );
    
    if (!hasValidType) {
      console.log('⚠️ No valid diagram type found');
      return false;
    }
    
    // Check for basic structure (at least some content after diagram type)
    const lines = code.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      console.log('⚠️ Diagram too short');
      return false;
    }
    
    // Check for balanced brackets
    const openBrackets = (code.match(/[\[\{\(]/g) || []).length;
    const closeBrackets = (code.match(/[\]\}\)]/g) || []).length;
    
    // Allow some flexibility in bracket matching as Mermaid syntax varies
    const bracketDifference = Math.abs(openBrackets - closeBrackets);
    if (bracketDifference > 5) { // Allow some tolerance
      console.log(`⚠️ Unbalanced brackets: ${openBrackets} open, ${closeBrackets} close`);
      return false;
    }
    
    // Check for common syntax errors
    const hasCommonErrors = [
      /^\s*```/m,  // Starts with markdown
      /error:/i,   // Contains error messages
      /undefined/i, // Contains undefined references
      /null/i      // Contains null references
    ].some(pattern => pattern.test(code));
    
    if (hasCommonErrors) {
      console.log('⚠️ Contains common syntax errors');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('Error in basic validation:', error.message);
    return false;
  }
}

// Additional helper function to clean and validate individual diagram
function processIndividualDiagram(diagramName, diagramCode) {
  try {
    // Type check
    if (typeof diagramCode !== 'string') {
      console.log(`❌ ${diagramName}: Not a string`);
      return null;
    }
    
    // Length check
    const trimmedCode = diagramCode.trim();
    if (trimmedCode.length === 0) {
      console.log(`❌ ${diagramName}: Empty code`);
      return null;
    }
    
    // Clean markdown
    let cleanedCode = trimmedCode
      .replace(/```mermaid\n?/g, '')
      .replace(/```\n?$/g, '')
      .trim();
    
    // Error message check
    if (cleanedCode.toLowerCase().includes('error') || 
        cleanedCode.toLowerCase().includes('failed')) {
      console.log(`❌ ${diagramName}: Contains error message`);
      return null;
    }
    
    // Minimum viable diagram check
    if (cleanedCode.length < 20) {
      console.log(`❌ ${diagramName}: Too short (${cleanedCode.length} chars)`);
      return null;
    }
    
    // Basic Mermaid structure check
    const validStarts = [
      'classDiagram', 'sequenceDiagram', 'erDiagram', 
      'graph', 'flowchart'
    ];
    
    const hasValidStart = validStarts.some(start => 
      cleanedCode.toLowerCase().startsWith(start.toLowerCase())
    );
    
    if (!hasValidStart) {
      console.log(`❌ ${diagramName}: Invalid diagram type`);
      return null;
    }
    
    console.log(`✅ ${diagramName}: Valid diagram (${cleanedCode.length} chars)`);
    return cleanedCode;
    
  } catch (error) {
    console.error(`❌ Error processing ${diagramName}:`, error.message);
    return null;
  }
};

// Helper function to get project with diagrams
exports.getProjectWithDiagrams = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('user', 'name email')
      .lean();
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission to view this project
    if (project.user._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Combine diagram names with their codes for easy consumption
    const diagramsWithCodes = project.diagrams.map((name, index) => ({
      name,
      code: project.diagramCodes[index] || '',
      image: project.diagramImages[index] || null
    }));
    
    res.json({
      project: {
        ...project,
        diagramsWithCodes
      }
    });
    
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      message: 'Failed to retrieve project',
      error: error.message
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