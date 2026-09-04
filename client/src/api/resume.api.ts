import axios from "axios";
import { getAuthHeaders } from "./user.api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_URL = `${API_BASE_URL}/resumes`;

export interface ParsedResume {
  _id: string;
  originalFileName: string;
  rawText: string;
  parsedData: {
    fullName?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills: string[];
    experienceYears?: number;
    education?: Array<{ degree?: string; institution?: string; year?: string }>;
    workHistory?: Array<{ title?: string; company?: string; duration?: string; description?: string }>;
    projects?: Array<{ name?: string; description?: string; techStack?: string[]; link?: string }>;
    certifications?: string[];
  };
  atsEvaluations: Array<{
    jobId?: string;
    jobTitle: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    evaluatedAt: string;
  }>;
}

export interface ATSEvaluationResponse {
  message: string;
  evaluation: {
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    summary: string;
  };
}

export const uploadResume = async (formData: FormData): Promise<{ message: string; resume: ParsedResume }> => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
  });
  return response.data;
};

export const getCandidateResume = async (): Promise<ParsedResume> => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const evaluateATS = async (payload: {
  jobId?: string;
  jobTitle?: string;
  description?: string;
  requiredSkills?: string[];
}): Promise<ATSEvaluationResponse> => {
  const response = await axios.post(`${API_URL}/evaluate-ats`, payload, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};
