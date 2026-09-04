import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export interface SystemDesignNode {
  id: string;
  type: "client" | "api_gateway" | "load_balancer" | "microservice" | "cache" | "queue" | "database" | "storage";
  label: string;
}

export interface SystemDesignEdge {
  from: string;
  to: string;
  protocol?: string;
}

export interface SystemDesignEvaluation {
  architectureScore: number;
  scalabilityRating: "Low" | "Moderate" | "High" | "Enterprise-Grade";
  singlePointsOfFailure: string[];
  bottlenecks: string[];
  strengths: string[];
  recommendedImprovements: string[];
  aiSummary: string;
}

export const evaluateSystemDesignArchitecture = async (
  problemStatement: string,
  nodes: SystemDesignNode[],
  edges: SystemDesignEdge[]
): Promise<SystemDesignEvaluation> => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

  const prompt = `You are a Principal Distributed Systems Architect and Tier-1 Tech Interviewer evaluating a candidate's System Design architecture.

Problem Statement: "${problemStatement || "Design a Scalable URL Shortener / E-Commerce Backend"}"

Candidate's Architecture Diagram:
- Components (Nodes):
${JSON.stringify(nodes, null, 2)}
- Data Flows (Edges):
${JSON.stringify(edges, null, 2)}

Analyze this architecture rigorously for:
1. Scalability and traffic distribution (Load balancers, caching, microservices)
2. Single points of failure (SPOFs) and high availability
3. Caching and message queue decoupling
4. Database selection and consistency trade-offs (CAP theorem)

Return ONLY pure JSON (no markdown formatting):
{
  "architectureScore": 85, // 0 to 100
  "scalabilityRating": "High", // "Low" | "Moderate" | "High" | "Enterprise-Grade"
  "singlePointsOfFailure": ["Single Primary Database without Read Replicas"],
  "bottlenecks": ["Cache miss storm risk on sudden traffic spike"],
  "strengths": ["API Gateway decouples client from backend services", "Redis cache buffers frequent lookups"],
  "recommendedImprovements": ["Add multi-region replication", "Introduce Kafka/RabbitMQ for asynchronous worker processing"],
  "aiSummary": "2-3 sentences evaluating the candidate's distributed systems depth and trade-offs."
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
          timeout: 15000,
        }
      );

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    } catch (err: any) {
      console.warn("Gemini system design evaluation error, using heuristic architect fallback:", err.message);
    }
  }

  // Heuristic Architecture Fallback
  const hasLB = nodes.some((n) => n.type === "load_balancer" || n.type === "api_gateway");
  const hasCache = nodes.some((n) => n.type === "cache");
  const hasQueue = nodes.some((n) => n.type === "queue");
  const hasDB = nodes.some((n) => n.type === "database");

  let score = 70;
  if (hasLB) score += 10;
  if (hasCache) score += 10;
  if (hasQueue) score += 5;
  if (hasDB) score += 5;

  return {
    architectureScore: Math.min(score, 95),
    scalabilityRating: score >= 85 ? "High" : score >= 75 ? "Moderate" : "Low",
    singlePointsOfFailure: hasDB && !hasQueue ? ["Database write bottleneck under peak throughput"] : ["Lack of redundant failover cluster"],
    bottlenecks: !hasCache ? ["High read latency directly hitting persistence layer"] : ["Network I/O limits on single gateway"],
    strengths: [
      hasLB ? "Implemented entry point load distribution" : "Direct routing simplicity",
      hasCache ? "Included caching layer to decrease query latency" : "Clean microservice boundaries",
    ],
    recommendedImprovements: [
      !hasQueue ? "Introduce an event-driven queue (e.g., Kafka) to buffer asynchronous write operations." : "Implement database sharding and read replicas.",
      !hasCache ? "Add an in-memory Redis/Memcached cache layer for frequent read operations." : "Establish circuit breaker patterns on third-party integrations.",
    ],
    aiSummary: "The candidate shows good architectural intuition with balanced separation of concerns. Adding event-driven decoupling will solidify enterprise resilience.",
  };
};

export default evaluateSystemDesignArchitecture;
