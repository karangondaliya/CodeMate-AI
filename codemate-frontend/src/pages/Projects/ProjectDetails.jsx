import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../../services/projectService';
import DiagramViewer from '../../components/diagrams/DiagramViewer';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('summary');
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
        
        // Set the first diagram as active if there's no summary
        if (!data.summary && data.diagrams && data.diagrams.length > 0) {
          setActiveTab(`diagram-0`);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  // Function to get the summary for the requested role only
  const getRoleSummary = (summary, role) => {
    if (!summary) return null;
    
    try {
      // Parse the summary JSON
      const parsedSummary = JSON.parse(summary);
      
      // Map role from the dropdown selection to the role in the summary
      const roleMapping = {
        'Backend': 'Backend Engineers',
        'Frontend': 'Frontend Developers',
        'AI Engineer': 'AI Engineers',
        'Product Manager': 'Product Managers',
        'Normal': 'Product Managers' // Default to Product Managers for Normal role
      };
      
      // Get the corresponding summary key for the selected role
      const summaryKey = roleMapping[role] || role;
      
      // If it's an object with role-based summaries, return only the requested role's summary
      if (typeof parsedSummary === 'object' && parsedSummary !== null) {
        const roleSummary = parsedSummary[summaryKey];
        
        if (roleSummary) {
          return (
            <div className="role-summary">
              <h3>{project.role} Perspective</h3>
              <p>{roleSummary}</p>
            </div>
          );
        } else {
          return (
            <div className="role-summary">
              <p>No summary available for this role.</p>
            </div>
          );
        }
      }
    } catch (e) {
      // If it's not valid JSON, display as plain text
      return <pre className="summary-text">{summary}</pre>;
    }
    
    // Fallback to plain text
    return <pre className="summary-text">{summary}</pre>;
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project analysis...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="not-found-container">
        <h2>Project Not Found</h2>
        <p>The requested project could not be found.</p>
        <Link to="/" className="btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  // Extract repo name from GitHub URL for display
  const repoName = project.githubUrl.replace('https://github.com/', '');
  
  return (
    <div className="project-details">
      <div className="project-header">
        <div className="project-title">
          <h1>{repoName}</h1>
          <span className="role-badge">{project.role} View</span>
        </div>
        <div className="project-meta">
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="github-link"
          >
            View on GitHub
          </a>
          <span className="date">
            {new Date(project.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="tabs-container">
        <div className="tabs">
          {project.summary && (
            <button 
              className={activeTab === 'summary' ? 'tab active' : 'tab'} 
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
          )}
          
          {project.diagrams && project.diagrams.map((diagram, idx) => (
            <button 
              key={idx}
              className={activeTab === `diagram-${idx}` ? 'tab active' : 'tab'} 
              onClick={() => setActiveTab(`diagram-${idx}`)}
            >
              {diagram}
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {activeTab === 'summary' && (
            <div className="summary-container">
              <h2>Code Repository Summary</h2>
              <div className="summary-content">
                {getRoleSummary(project.summary, project.role)}
              </div>
            </div>
          )}
          
          {activeTab.startsWith('diagram-') && (
              <div className="diagram-content">
                {console.log('Diagram code:', project.diagramCodes?.[parseInt(activeTab.split('-')[1])] || '')}
                <DiagramViewer 
                  diagramType={project.diagrams[parseInt(activeTab.split('-')[1])]}
                  diagramCode={project.diagramCodes?.[parseInt(activeTab.split('-')[1])] || ''}
                />
              </div>
            )}
        </div>
      </div>
      
      <div className="back-link">
        <Link to="/" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetails;