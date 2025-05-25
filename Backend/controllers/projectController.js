// const Project = require('../models/Project');
// const axios = require('axios');
// require('dotenv').config();

// exports.createProject = async (req, res) => {
//   try {
//     const { githubUrl, roleInProject, diagramsRequested } = req.body;

//     if (!githubUrl.startsWith('https://github.com')) {
//       return res.status(400).json({ message: 'Invalid GitHub URL' });
//     }

//     // Step 1: Clone or fetch repo content (optional for this mock)
//     // You can use GitHub API to get README or file content if needed

//     // Step 2: Construct prompt
//     const prompt = `
// You are an AI engineer helping analyze open-source GitHub projects. 
// Given this public GitHub URL: ${githubUrl}, and assuming the user is contributing as a ${roleInProject}, 
// analyze the repository and return the following:

// 1. A concise summary of the project and user's potential contribution.
// 2. Generate diagram codes (in Mermaid syntax) for:
//    ${diagramsRequested.join(', ')}

// Respond in the following JSON format:
// {
//   "summary": "short project summary",
//   "diagramCode": {
//     "class": "mermaid code here...",
//     "sequence": "...",
//     "flowchart": "..."
//   },
//   "diagramImage": {
//     "class": "base64 PNG string here...",
//     "sequence": "...",
//     "flowchart": "..."
//   }
// }
// `;

//     // Step 3: Call Gemini API
//     const geminiRes = await axios.post(
//       'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
//       {
//         contents: [{
//           parts: [{ text: prompt }]
//         }]
//       },
//       {
//         headers: { 'Content-Type': 'application/json' }
//       }
//     );

//     // Step 4: Extract response (parsing JSON block from text)
//     const modelText = geminiRes.data.candidates[0].content.parts[0].text;

//     // Basic JSON block extraction (may vary depending on format)
//     const match = modelText.match(/```json([\s\S]*?)```/);
//     const jsonStr = match ? match[1].trim() : modelText;
//     const parsed = JSON.parse(jsonStr);

//     const { summary, diagramCode, diagramImage } = parsed;

//     const project = await Project.create({
//       user: req.user.id,
//       githubUrl,
//       role,
//       diagramsRequested,
//       summary,
//       diagramCode,
//       diagramImage,
//     });

//     res.status(201).json({ message: 'Project created and analyzed', project });
//   } catch (error) {
//     console.error('Project creation error:', error.message);
//     res.status(500).json({ message: 'Failed to create project', error: error.message });
//   }
// };

const History = require('../models/History');
const Project = require('../models/Project');
const axios = require('axios');
require('dotenv').config();

exports.createProject = async (req, res) => {
  try {
    const { githubUrl, role, diagrams } = req.body;

    
    if (!githubUrl.startsWith('https://github.com/')) {
      return res.status(400).json({ message: 'Invalid GitHub URL' });
    }
    if (!Array.isArray(diagrams) || diagrams.length === 0) {
      return res.status(400).json({ message: 'At least one diagram must be selected' });
    }

    
        const prompt = `
        As a senior software engineer analyzing the GitHub repository at ${githubUrl}, 
        provide for a ${role} contributor:

        1. Technical Summary (150-200 words):
        - Focus on ${role}-specific architecture and components
        - Highlight key technical patterns and decisions

        2. Mermaid.js Code for: ${diagrams.join(', ')}

        Respond with pure JSON (no markdown) using this structure:
        {
        "summary": "concise technical summary here",
        "diagramCodes": {
            ${diagrams.map(d => `"${d}": "mermaid code"`).join(',\n    ')}
        }
        }
        Ensure valid JSON formatting without any extra text.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

        const geminiRes = await axios.post(
        apiUrl,
        {
            contents: [{
            parts: [{ text: prompt }]
            }],
            generationConfig: {  
            response_mime_type: "application/json"
            }
        },
        {
            headers: { 'Content-Type': 'application/json' }
        }
        );

    const responseText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const cleanResponse = responseText.replace(/```json/g, '').replace(/```/g, '');
    const { summary, diagramCodes } = JSON.parse(cleanResponse);

    const missingDiagrams = diagrams.filter(d => !diagramCodes[d]);
    if (missingDiagrams.length > 0) {
      return res.status(400).json({ message: `Missing diagrams: ${missingDiagrams.join(', ')}` });
    }

    const diagramImages = [];
    for (const diagramType of diagrams) {
      try {
        const code = diagramCodes[diagramType];
        const encoded = Buffer.from(code)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        
        const { data } = await axios.get(`https://mermaid.ink/img/${encoded}`, {
          responseType: 'arraybuffer'
        });
        
        diagramImages.push(Buffer.from(data).toString('base64'));
      } catch (error) {
        console.error(`Diagram generation failed for ${diagramType}:`, error);
        return res.status(500).json({ 
          message: `Failed to generate ${diagramType} diagram: ${error.message}`
        });
      }
    }

    const project = await Project.create({
      user: req.user.id,
      role,
      githubUrl,
      diagrams,
      summary,
      diagramImages
    });

    await History.create({
  user: req.user.id,
  project: project._id,
  action: 'Created' // or 'Analyzed' if that's more accurate
  });


    const responseData = project.toObject();
    delete responseData.diagramImages;

    res.status(201).json({
      message: 'Project analysis complete',
      project: responseData
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
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 }); //-1 is foe recent project
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch project history', error });
  }
};