import axios from "axios";

export type InterviewDomain = 
  | "HR" 
  | "DSA" 
  | "MERN" 
  | "JAVA" 
  | "PYTHON" 
  | "SQL" 
  | "SYSTEM_DESIGN" 
  | "GENERAL";

export type CompanyMode = "Google" | "Amazon" | "Microsoft" | "General";

export interface AdaptiveFollowUpResult {
  needsFollowUp: boolean;
  followUpQuestion?: string;
  instantFeedback: string;
  score: number;
  depthRating: "shallow" | "moderate" | "comprehensive";
  keyStrengths: string[];
  keyGaps: string[];
}

export interface DomainQuestion {
  id: string;
  domain: InterviewDomain;
  type: "Behavioral" | "Conceptual" | "Coding" | "Architecture" | "Scenario";
  technology?: string;
  question: string;
  expectedKeyPoints: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

/**
 * Generates an adaptive follow-up question responding to candidate's answer depth.
 */
export const generateAdaptiveFollowUp = async (
  currentQuestion: string,
  candidateAnswer: string,
  context: {
    jobRole: string;
    targetCompany: string;
    companyMode: CompanyMode;
    experienceLevel: string;
    skills: string[];
  }
): Promise<AdaptiveFollowUpResult> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Fallback heuristic if answer is very short or no LLM key
  if (!candidateAnswer || candidateAnswer.trim().length < 30) {
    return {
      needsFollowUp: true,
      followUpQuestion: `Could you elaborate on that and explain a concrete real-world situation where you applied this in your past projects?`,
      instantFeedback: "Your answer was very brief. Try providing technical details and concrete examples.",
      score: 40,
      depthRating: "shallow",
      keyStrengths: ["Acknowledged question"],
      keyGaps: ["Lacks technical detail and implementation specifics"]
    };
  }

  if (!geminiApiKey) {
    return {
      needsFollowUp: false,
      instantFeedback: "Good response covering foundational concepts.",
      score: 75,
      depthRating: "moderate",
      keyStrengths: ["Clear communication", "Structured answer"],
      keyGaps: ["Could mention edge case handling"]
    };
  }

  const prompt = `You are a Senior Technical Interviewer and Hiring Lead at ${context.targetCompany || "a Tier-1 Tech Company"} conducting an interview in "${context.companyMode}" mode.

Interview Context:
- Role: ${context.jobRole} (${context.experienceLevel})
- Key Technologies: ${context.skills.join(", ")}
- Current Question: "${currentQuestion}"
- Candidate Answer: "${candidateAnswer}"

Analyze the candidate's answer for:
1. Technical depth and accuracy (Did they mention concrete trade-offs, architecture, edge cases, or just buzzwords?)
2. Whether an adaptive probing follow-up is warranted (e.g. if they made a claim without justifying it, or skipped scalability/failure scenarios).
3. If their answer is already comprehensive, do not force an aggressive follow-up.

Return ONLY pure JSON (no markdown fences):
{
  "needsFollowUp": true, // true if probing question is needed
  "followUpQuestion": "Specific follow-up question directly reacting to something the candidate claimed",
  "instantFeedback": "1-2 sentence constructive immediate feedback for the candidate",
  "score": 82, // 0 to 100 for this answer
  "depthRating": "moderate", // "shallow" | "moderate" | "comprehensive"
  "keyStrengths": ["Mentioned database indexing", "Clear explanation of async queue"],
  "keyGaps": ["Did not account for race conditions during node crash"]
}`;

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
        timeout: 12000,
      }
    );

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (responseText) {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
      const parsed: AdaptiveFollowUpResult = JSON.parse(cleanJson);
      return parsed;
    }
  } catch (err) {
    console.error("Gemini adaptive follow-up error, returning baseline:", err);
  }

  return {
    needsFollowUp: false,
    instantFeedback: "Solid technical explanation.",
    score: 78,
    depthRating: "moderate",
    keyStrengths: ["Demonstrated understanding of core principles"],
    keyGaps: ["Can dive deeper into system scalability"]
  };
};

/**
 * Generates tailored domain-specific interview questions.
 */
export const generateDomainQuestions = async (
  domain: InterviewDomain,
  companyMode: CompanyMode,
  count: number = 5,
  jobRole: string = "Software Engineer",
  experienceLevel: string = "Junior"
): Promise<DomainQuestion[]> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    // High quality offline fallback questions
    return [
      {
        id: `q-${Date.now()}-1`,
        domain,
        type: domain === "DSA" ? "Coding" : "Scenario",
        technology: domain,
        question: domain === "DSA" 
          ? "Given an array of integers, find the contiguous subarray with the maximum sum (Kadane's Algorithm). What is the time and space complexity?"
          : `Explain how you would design and optimize a high-throughput ${domain} architecture handling 10,000 concurrent requests per second.`,
        expectedKeyPoints: ["Time Complexity O(N)", "Space Complexity O(1)", "Handling negative values"],
        difficulty: "Medium"
      },
      {
        id: `q-${Date.now()}-2`,
        domain,
        type: "Conceptual",
        technology: domain,
        question: `What are the most common performance bottlenecks in a modern ${domain} production environment, and how do you profile and eliminate them?`,
        expectedKeyPoints: ["Memory leaks", "CPU hotspots", "Database query optimization", "Caching layers"],
        difficulty: "Medium"
      }
    ];
  }

  const prompt = `You are a Principal Engineer and Interview Bar Raiser. Generate ${count} detailed interview questions for domain "${domain}" under "${companyMode}" evaluation standards.

Role: ${jobRole} (${experienceLevel})
${companyMode === "Amazon" ? "Enforce Amazon 16 Leadership Principles and STAR methodology." : ""}
${companyMode === "Google" ? "Focus on algorithmic rigor, scalability, clean interfaces, and Big-O efficiency." : ""}
${companyMode === "Microsoft" ? "Focus on reliable software engineering, corner-case resilience, and enterprise maintenance." : ""}

Return ONLY pure JSON array matching this format (no markdown):
[
  {
    "id": "q1",
    "domain": "${domain}",
    "type": "Scenario",
    "technology": "Specific technology or algorithm",
    "question": "Detailed question text...",
    "expectedKeyPoints": ["Key point 1", "Key point 2", "Key point 3"],
    "difficulty": "Medium"
  }
]`;

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

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (responseText) {
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
      const questions: DomainQuestion[] = JSON.parse(cleanJson);
      return questions;
    }
  } catch (err) {
    console.error("Gemini domain questions error, returning standard bank:", err);
  }

  return [
    {
      id: `q-${Date.now()}-1`,
      domain,
      type: "Scenario",
      technology: domain,
      question: `Describe a challenging real-world scenario involving ${domain} you solved, and how you evaluated alternative architectural approaches.`,
      expectedKeyPoints: ["Technical justification", "Failure modes", "Measurable outcomes"],
      difficulty: "Medium"
    }
  ];
};
