import axios from "axios";
import { ParsedResumeData } from "./resumeParser.service";

export interface ATSEvaluationResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  summary: string;
}

/**
 * Calculates ATS match score and skill gaps between a candidate's parsed resume and a Job Description.
 */
export const calculateATSScore = async (
  resumeData: ParsedResumeData,
  rawResumeText: string,
  jobTitle: string,
  jobDescription: string,
  requiredSkills: string[] = []
): Promise<ATSEvaluationResult> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // Algorithmic keyword baseline computation
  const candidateSkillsLower = (resumeData.skills || []).map(s => s.toLowerCase().trim());
  const resumeTextLower = rawResumeText.toLowerCase();

  const requiredLower = requiredSkills.map(s => s.toLowerCase().trim());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredLower.forEach((reqSkill, idx) => {
    const originalSkill = requiredSkills[idx];
    if (candidateSkillsLower.includes(reqSkill) || resumeTextLower.includes(reqSkill)) {
      matchedSkills.push(originalSkill);
    } else {
      missingSkills.push(originalSkill);
    }
  });

  const skillMatchRatio = requiredSkills.length > 0 
    ? matchedSkills.length / requiredSkills.length 
    : 0.75;

  let baselineScore = Math.round(skillMatchRatio * 75 + 15);
  baselineScore = Math.min(Math.max(baselineScore, 25), 98);

  const fallbackRecommendations: string[] = [
    ...(missingSkills.length > 0 ? [`Add proven experience with missing core skills: ${missingSkills.slice(0, 4).join(", ")}`] : []),
    "Quantify accomplishments with business metrics (e.g., 'Reduced latency by 35%')",
    `Tailor summary statement to explicitly target the ${jobTitle} position`
  ];

  // If Gemini API Key is available, augment with deep LLM analysis
  if (geminiApiKey) {
    try {
      const prompt = `You are a high-level Applicant Tracking System (ATS) and Senior Technical Hiring Manager.
Evaluate the candidate's resume against the target Job Description.

Job Title: ${jobTitle}
Required Skills: ${requiredSkills.join(", ")}
Job Description:
"""
${jobDescription.slice(0, 3000)}
"""

Candidate Resume Summary:
${resumeData.summary || ""}
Candidate Skills: ${resumeData.skills.join(", ")}
Resume Excerpt:
"""
${rawResumeText.slice(0, 3000)}
"""

Evaluate and return ONLY a valid JSON object:
{
  "matchScore": 82, // integer between 0 and 100
  "matchedSkills": ["React", "Node.js"],
  "missingSkills": ["Kubernetes", "GraphQL"],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ],
  "summary": "2-sentence overall evaluation of candidate fit"
}

Important: Return ONLY pure JSON without markdown fences.`;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
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
        const llmResult = JSON.parse(cleanJson);
        return {
          matchScore: typeof llmResult.matchScore === "number" ? llmResult.matchScore : baselineScore,
          matchedSkills: Array.isArray(llmResult.matchedSkills) && llmResult.matchedSkills.length > 0 ? llmResult.matchedSkills : matchedSkills,
          missingSkills: Array.isArray(llmResult.missingSkills) ? llmResult.missingSkills : missingSkills,
          recommendations: Array.isArray(llmResult.recommendations) ? llmResult.recommendations : fallbackRecommendations,
          summary: llmResult.summary || `Candidate possesses ${matchedSkills.length} of ${requiredSkills.length} key competencies for ${jobTitle}.`
        };
      }
    } catch (err) {
      console.error("Gemini ATS evaluation error, using algorithmic score:", err);
    }
  }

  return {
    matchScore: baselineScore,
    matchedSkills,
    missingSkills,
    recommendations: fallbackRecommendations,
    summary: `Candidate has a ${baselineScore}% match with ${matchedSkills.length} verified competencies for ${jobTitle}.`
  };
};
