import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/authService';
import './Profile.css';

const roleOptions = [
  'Backend',
  'Frontend',
  'AI Engineer',
  'Product Manager',
  'Normal',
];

const Profile = () => {
  const { currentUser, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        confirmPassword: '',
        role: currentUser.role || '',
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate passwords if changing
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Only include fields that were changed
      const updateData = {};
      if (formData.name !== currentUser.name) updateData.name = formData.name;
      if (formData.role !== currentUser.role) updateData.role = formData.role;
      if (formData.password) updateData.password = formData.password;
      
      // Only update if there are changes
      if (Object.keys(updateData).length === 0) {
        setSuccess('No changes to update');
        setLoading(false);
        return;
      }
      
      console.log("Updating profile with data:", updateData); // Debug log
      
      const response = await updateUserProfile(updateData);
      setSuccess('Profile updated successfully');
      
      // Update the current user in context if the response includes user data
      if (response && response.user) {
        // Update AuthContext with the new user data
        const token = localStorage.getItem('token');
        login(token, response.user);
      }
      
      // Reset password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
      
    } catch (err) {
      console.error("Profile update error:", err); // Debug log
      setError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your account details</p>
      </div>
      
      <div className="profile-content">
        {success && <div className="success-alert">{success}</div>}
        {error && <div className="error-alert">{error}</div>}
        
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                disabled
              />
              <p className="field-hint">Email cannot be changed</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select-field"
                required
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Change Password</h2>
            <p className="section-desc">Leave blank if you don't want to change it</p>
            
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter new password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;