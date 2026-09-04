import axios from "axios";
import { UserRole } from "@/vite-env";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const API_URL = `${API_BASE_URL}/users`;

// Helper to get auth header
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
  headline?: string;
  adminSecret?: string;
  firebaseUID?: string;
}

export interface LoginUserPayload {
  email?: string;
  password?: string;
  firebaseUID?: string;
}

export interface EditUserPayload {
  name?: string;
  companyName?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  parsedSkills?: string[];
}

export const getUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/getuserdetails`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting user details:", (error as any).response?.data?.message);
    throw error;
  }
};

// Register User
export const registerUser = async (userData: RegisterUserPayload) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Error registering user:", (error as any).response?.data?.error);
    throw error;
  }
};

// Login User
export const loginUser = async (userData: LoginUserPayload) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Error in user Login:", (error as any).response?.data?.message);
    throw error;
  }
};

// Edit User
export const editUser = async (userData: EditUserPayload) => {
  try {
    const response = await axios.put(`${API_URL}/edit`, userData, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", (error as any).response?.data?.message);
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    localStorage.removeItem("token");
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging out user:", (error as any).response?.data?.message);
    throw error;
  }
};


