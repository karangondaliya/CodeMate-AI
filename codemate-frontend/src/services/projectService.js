import api from './api';

export const createProject = async (projectData) => {
  try {
    const response = await api.post(`/project/add`, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserProjects = async () => {
  try {
    const response = await api.get('/project/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await api.get(`/project/history/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};