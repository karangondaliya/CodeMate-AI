import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getUserProjects } from '../../services/projectService';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getUserProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Group projects by day for better organization
  const groupProjectsByDate = () => {
    const grouped = {};
    
    projects.forEach(project => {
      const date = new Date(project.createdAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(project);
    });
    
    return grouped;
  };
  
  const groupedProjects = groupProjectsByDate();
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {currentUser?.name}</h1>
          <p>Your role-aware codebase insights assistant</p>
        </div>
        
        <div className="action-section">
          <Link to="/projects/new" className="btn-primary">
            Analyze New Repository
          </Link>
        </div>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{projects.length}</span>
          <span className="stat-label">Total Analyses</span>
        </div>
        {/* Add more stat cards as needed */}
      </div>
      
      <div className="project-section">
        <h2>Your Analysis Projects</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No projects yet</h3>
            <p>Start by analyzing your first repository!</p>
            <Link to="/projects/new" className="btn-secondary">
              Analyze Repository
            </Link>
          </div>
        ) : (
          <div className="project-timeline">
            {Object.entries(groupedProjects).map(([date, dateProjects]) => (
              <div key={date} className="date-group">
                <div className="date-header">{date}</div>
                <div className="projects-list">
                  {dateProjects.map(project => {
                    const repoName = project.githubUrl.replace('https://github.com/', '');
                    return (
                      <Link 
                        to={`/projects/${project._id}`}
                        key={project._id}
                        className="project-card"
                      >
                        <div className="project-info">
                          <h3 className="project-name">{repoName}</h3>
                          <div className="project-meta">
                            <span className="role-tag">{project.role}</span>
                            <span className="time">
                              {new Date(project.createdAt).toLocaleTimeString([], {
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="project-arrow">→</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;