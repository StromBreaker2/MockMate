import { MockInterview } from '@/vite-env';
import axios, { AxiosResponse } from 'axios';
import { getAuthHeaders } from './user.api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_URL = `${API_BASE_URL}/ai`;

interface GenerateRequest {
  interviewID: string;
}

interface GenerateReviewRequest {
  InterviewDetailsObject: MockInterview;
}

export interface AdaptiveFollowUpPayload {
  currentQuestion: string;
  candidateAnswer: string;
  jobRole?: string;
  targetCompany?: string;
  companyMode?: string;
  experienceLevel?: string;
  skills?: string[];
}

export interface AdaptiveFollowUpResponse {
  needsFollowUp: boolean;
  followUpQuestion?: string;
  instantFeedback: string;
  score: number;
  depthRating: "shallow" | "moderate" | "comprehensive";
  keyStrengths: string[];
  keyGaps: string[];
}

// Function to generate standard interview questions
export const generateQuestions = async (data: GenerateRequest): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API_URL}/generatequestions`, data, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to generate Questions: ${error}`);
  }
};

// Function to generate review
export const generateReview = async (data: GenerateReviewRequest): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(`${API_URL}/generatereview`, data, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response;
  } catch (error) {
    throw new Error(`Failed to generate Review: ${error}`);
  }
};

// Function to request adaptive follow-up
export const getAdaptiveFollowUp = async (
  data: AdaptiveFollowUpPayload
): Promise<AdaptiveFollowUpResponse> => {
  try {
    const response = await axios.post(`${API_URL}/adaptive-followup`, data, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Adaptive follow-up error:", error);
    return {
      needsFollowUp: false,
      instantFeedback: "Answer received. Moving to next topic.",
      score: 75,
      depthRating: "moderate",
      keyStrengths: ["Clear communication"],
      keyGaps: []
    };
  }
};

// Function to fetch domain questions
export const getDomainQuestions = async (payload: {
  domain: string;
  companyMode?: string;
  count?: number;
  jobRole?: string;
  experienceLevel?: string;
}): Promise<any[]> => {
  try {
    const response = await axios.post(`${API_URL}/domain-questions`, payload, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data.questions || [];
  } catch (error) {
    console.error("Domain questions fetch error:", error);
    return [];
  }
};

