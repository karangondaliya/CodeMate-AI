import api from './api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    // Log the data being sent to the API for debugging
    console.log('Sending update to API:', userData);
    
    const response = await api.put('/user/profile', userData);
    
    // Log the response for debugging
    console.log('API response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};