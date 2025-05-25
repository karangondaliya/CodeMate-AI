// src/api/auth.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

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