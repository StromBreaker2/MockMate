import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse");


export interface ParsedResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experienceYears?: number;
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
  }>;
  workHistory?: Array<{
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    techStack?: string[];
    link?: string;
  }>;
  certifications?: string[];
}

/**
 * Extracts raw textual content from a PDF file buffer.
 */
export const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to parse PDF document");
  }
};

/**
 * Fallback regex/heuristic parser when LLM is unavailable
 */
const fallbackRegexParser = (rawText: string): ParsedResumeData => {
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);

  const commonSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Express", "Python", "Java", "C++", 
    "SQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Git",
    "Tailwind CSS", "Next.js", "GraphQL", "REST API", "Microservices", "System Design",
    "Data Structures", "Algorithms", "HTML", "CSS", "Linux", "CI/CD", "Jest"
  ];

  const foundSkills = commonSkills.filter(skill => 
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText)
  );

  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    skills: foundSkills,
    summary: rawText.slice(0, 300).trim(),
    education: [],
    workHistory: [],
    projects: [],
    certifications: []
  };
};

/**
 * Parses raw resume text into structured candidate profile using Gemini AI.
 */
export const parseResumeWithAI = async (rawText: string): Promise<ParsedResumeData> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.warn("GEMINI_API_KEY is not set. Using heuristic fallback parser.");
    return fallbackRegexParser(rawText);
  }

  const prompt = `You are an expert HR Technology ATS Resume Parser. Analyze the following resume text and extract the candidate details in valid JSON format only without any markdown wrap or code blocks.
  
Resume Text:
"""
${rawText.slice(0, 10000)}
"""

Output JSON Schema:
{
  "fullName": "Candidate full name",
  "email": "Candidate email",
  "phone": "Candidate phone number",
  "summary": "Brief 2-3 sentence executive summary",
  "skills": ["JavaScript", "React", "Node.js", "Docker"],
  "experienceYears": 3,
  "education": [
    { "degree": "B.E. Computer Science", "institution": "University Name", "year": "2024" }
  ],
  "workHistory": [
    { "title": "Software Engineer", "company": "Tech Corp", "duration": "2022 - Present", "description": "Developed microservices" }
  ],
  "projects": [
    { "name": "Project Name", "description": "Key achievements", "techStack": ["React", "Express"], "link": "https://github.com" }
  ],
  "certifications": ["AWS Certified Solutions Architect"]
}

Important: Return ONLY pure JSON. No explanations, no markdown formatting.`;

  try {
    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: geminiApiKey },
        timeout: 15000,
      }
    );


    const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return fallbackRegexParser(rawText);
    }

    const cleanJsonString = candidateText.replace(/```json\n?|\n?```/g, "").trim();
    const parsedData: ParsedResumeData = JSON.parse(cleanJsonString);
    return parsedData;
  } catch (error) {
    console.error("Gemini Resume Parsing error, falling back to heuristic parser:", error);
    return fallbackRegexParser(rawText);
  }
};
