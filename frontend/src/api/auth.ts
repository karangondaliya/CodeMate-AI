// src/api/auth.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const token = localStorage.getItem('authToken')

export async function registerUser(data: { 
  name: string; 
  email: string; 
  password: string; 
  role: string 
}) {
  try {
    const response = await axios.post(`${API_BASE}/auth/signup`, data);
    
    // Transform the response to match what your component expects
    return {
      status: response.status,
      data: response.data.user // Extract user from the response
    };
  } catch (error: any) {
    // Re-throw the error in the format your component expects
    throw error;
  }
}

export async function loginUser(data: { 
  email: string; 
  password: string 
}) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, data);
    
    // Transform the response to match what your component expects
    return {
      status: response.status,
      data: response.data.user,
      token: response.data.token
    };
  } catch (error: any) {
    // Re-throw the error in the format your component expects
    throw error;
  }
}

export const addProject = async (projectData: {
  githubLink: string;
  role: string;
}) => {
  try {
    // Make sure this endpoint exists in your backend
    const response = await fetch('/api/project/add', {  // or whatever your correct endpoint is
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding project:', error);
    
    // Re-throw with more specific error message
    if (error instanceof Error) {
      throw new Error(`Failed to add project: ${error.message}`);
    }
    throw new Error('Failed to add project: Unknown error');
  }
};