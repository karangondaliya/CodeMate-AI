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

const ALL_DIAGRAM_TYPES = [
  "Class Diagram", 
  "Sequence Diagram", 
  "ER Diagram", 
  "Use Case Diagram", 
];

export const addProject = async (projectData: {
  githubLink: string;
  role: string;
  generateDiagram?: boolean;
}) => {
  try {
    // Restructure the data to match what the backend expects
    const backendData = {
      githubUrl: projectData.githubLink, // Change the key name to match backend
      role: projectData.role,
      requested_diagrams: projectData.generateDiagram ? ALL_DIAGRAM_TYPES : [] // Add this if needed
      // branch is not required as it has a default value on the backend
    };

    const response = await axios.post(`${API_BASE}/project/add`, backendData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding project:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      const serverErrorMsg = error.response.data?.message || error.response.data?.error;
      if (serverErrorMsg) {
        throw new Error(`Server error: ${serverErrorMsg}`);
      }
      throw new Error(`Server error (${error.response.status}): ${error.message}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`Failed to add project: ${error.message}`);
    }
    throw new Error('Failed to add project: Unknown error');
  }
};