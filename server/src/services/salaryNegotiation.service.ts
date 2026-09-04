import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface NegotiationTurn {
  role: "candidate" | "hr_negotiator";
  message: string;
  proposedBaseSalary?: number;
  proposedEquity?: number;
  proposedSignOnBonus?: number;
}

export interface NegotiationAnalysis {
  hrResponse: string;
  decision: "ACCEPTED" | "COUNTER_OFFER" | "REJECTED_FIRM";
  tactScore: number; // 0 to 100
  marketCompetitivenessScore: number; // 0 to 100
  counterOffer: {
    baseSalary: number;
    equity: number;
    signOnBonus: number;
  };
  critique: string;
  recommendedNextMove: string;
}

export const simulateSalaryNegotiation = async (
  jobTitle: string,
  level: string,
  initialOffer: { baseSalary: number; equity: number; signOnBonus: number },
  candidateCounter: { baseSalary: number; equity: number; signOnBonus: number; justification: string },
  conversationHistory: NegotiationTurn[] = []
): Promise<NegotiationAnalysis> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

  const prompt = `You are a savvy Vice President of Human Resources / Talent at a high-growth tech company negotiating a compensation package with a selected engineering candidate.

Position: ${jobTitle} (${level})
Initial Company Offer:
- Base Salary: $${initialOffer.baseSalary.toLocaleString()}
- Equity/RSUs: $${initialOffer.equity.toLocaleString()} / 4 years
- Sign-on Bonus: $${initialOffer.signOnBonus.toLocaleString()}

Candidate's Counter-Proposal:
- Requested Base: $${candidateCounter.baseSalary.toLocaleString()}
- Requested Equity: $${candidateCounter.equity.toLocaleString()}
- Requested Sign-on: $${candidateCounter.signOnBonus.toLocaleString()}
- Candidate's Justification: "${candidateCounter.justification}"

Conversation Context:
${conversationHistory.map((h) => `${h.role === "candidate" ? "Candidate" : "HR Lead"}: ${h.message}`).join("\n")}

Evaluate this negotiation move:
1. Tact & Professionalism: Did they express gratitude and enthusiasm, or sound entitled?
2. Market Realism: Is their request within realistic market compensation bands (+5% to +15% is standard, +40% is unrealistic)?
3. Justification Quality: Did they cite competing offers, verified market data, or specific high-impact skills?
4. Determine company stance: Accept, make a realistic compromise counter-offer, or hold firm.

Return ONLY pure JSON (no markdown formatting):
{
  "hrResponse": "Thank you for sharing your thoughts and reiterating your enthusiasm. While our compensation bands for L4 don't permit an increase to $160k base, we can meet you halfway by increasing your sign-on bonus to $25k...",
  "decision": "COUNTER_OFFER", // "ACCEPTED" | "COUNTER_OFFER" | "REJECTED_FIRM"
  "tactScore": 88, // 0 to 100
  "marketCompetitivenessScore": 84, // 0 to 100
  "counterOffer": {
    "baseSalary": 145000,
    "equity": 45000,
    "signOnBonus": 25000
  },
  "critique": "Strong professional tone with good enthusiasm. Citing specific cross-functional experience helped justify the bonus increase.",
  "recommendedNextMove": "Accept the sign-on bonus bump and request an accelerated 6-month performance & compensation review."
}`;

  if (geminiApiKey) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
          params: { key: geminiApiKey },
          timeout: 18000,
        }
      );

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    } catch (err: any) {
      console.warn("Gemini negotiation simulation error, using fallback HR evaluator:", err.message);
    }
  }

  // Fallback HR Evaluator
  const requestedBaseBump = (candidateCounter.baseSalary - initialOffer.baseSalary) / initialOffer.baseSalary;
  const compromiseBase = Math.round(initialOffer.baseSalary + (candidateCounter.baseSalary - initialOffer.baseSalary) * 0.5);
  const compromiseBonus = candidateCounter.signOnBonus > initialOffer.signOnBonus ? candidateCounter.signOnBonus : initialOffer.signOnBonus + 5000;

  return {
    hrResponse: `We are truly excited about the prospect of having you join our engineering team. We reviewed your proposal with the compensation committee. While our band structure does not allow us to fully reach $${candidateCounter.baseSalary.toLocaleString()} base, we can offer $${compromiseBase.toLocaleString()} base salary and increase your sign-on bonus to $${compromiseBonus.toLocaleString()}.`,
    decision: requestedBaseBump > 0.2 ? "COUNTER_OFFER" : "COUNTER_OFFER",
    tactScore: 85,
    marketCompetitivenessScore: 82,
    counterOffer: {
      baseSalary: compromiseBase,
      equity: initialOffer.equity,
      signOnBonus: compromiseBonus,
    },
    critique: "Well-structured negotiation letter. Grounding requests in market data and mutual alignment makes compensation increases easier for HR leadership to approve.",
    recommendedNextMove: "Express appreciation for the improved offer and verify start date, vesting schedule, and health benefits.",
  };
};

export default simulateSalaryNegotiation;
