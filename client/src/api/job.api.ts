import axios from "axios";
import { getAuthHeaders } from "./user.api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_URL = `${API_BASE_URL}/jobs`;

export interface JobPosting {
  _id: string;
  title: string;
  department: string;
  experienceLevel: "Fresher" | "Junior" | "Mid-Level" | "Senior";
  requiredSkills: string[];
  description: string;
  location: string;
  targetCompany: string;
  status: "active" | "closed";
  applicants: any[];
  recruiter: {
    _id: string;
    name: string;
    email: string;
    companyName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getAllJobs = async (params?: {
  search?: string;
  department?: string;
  experienceLevel?: string;
}): Promise<JobPosting[]> => {
  const response = await axios.get(API_URL, {
    params,
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const getJobById = async (id: string): Promise<JobPosting> => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const createJobPosting = async (jobData: {
  title: string;
  department: string;
  experienceLevel: string;
  requiredSkills: string[];
  description: string;
  location?: string;
  targetCompany?: string;
}): Promise<{ message: string; job: JobPosting }> => {
  const response = await axios.post(API_URL, jobData, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const getRecruiterJobs = async (): Promise<JobPosting[]> => {
  const response = await axios.get(`${API_URL}/recruiter`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const applyToJob = async (id: string): Promise<{ message: string; job: JobPosting }> => {
  const response = await axios.post(
    `${API_URL}/${id}/apply`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};
