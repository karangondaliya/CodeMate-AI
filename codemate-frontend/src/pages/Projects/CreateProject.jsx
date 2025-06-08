import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { createProject } from '../../services/projectService';
import './CreateProject.css';

const roleOptions = [
  'Backend',
  'Frontend',
  'AI_Engineer',
  'Product_Manager',
  'Normal',
];

const diagramOptions = [
  'Class Diagram',
  'Sequence Diagram',
  'ER Diagram',
  'Use Case Diagram',
];

const CreateProject = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    githubUrl: '',
    role: currentUser?.role || '',
    branch: 'main',
    requested_diagrams: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (diagram) => {
    if (formData.requested_diagrams.includes(diagram)) {
      setFormData({
        ...formData,
        requested_diagrams: formData.requested_diagrams.filter(d => d !== diagram),
      });
    } else {
      setFormData({
        ...formData,
        requested_diagrams: [...formData.requested_diagrams, diagram],
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!formData.githubUrl.startsWith('https://github.com/')) {
        throw new Error('Please enter a valid GitHub URL');
      }
      
      const response = await createProject(formData);
      navigate(`/projects/${response.project.id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project">
      <div className="page-header">
        <h1>Analyze Repository</h1>
        <p>Enter a GitHub repository URL to analyze and generate role-specific insights</p>
      </div>
      
      {error && <div className="error-alert">{error}</div>}
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="githubUrl">GitHub Repository URL</label>
          <input
            type="text"
            id="githubUrl"
            name="githubUrl"
            placeholder="https://github.com/username/repository"
            value={formData.githubUrl}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Analysis Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="select-field"
            >
              <option value="">Select a role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="branch">Branch Name</label>
            <input
              type="text"
              id="branch"
              name="branch"
              placeholder="main"
              value={formData.branch}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Select Diagrams (Optional)</label>
          <div className="checkbox-group">
            {diagramOptions.map((diagram) => (
              <label key={diagram} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.requested_diagrams.includes(diagram)}
                  onChange={() => handleCheckboxChange(diagram)}
                />
                {diagram}
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Repository'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;