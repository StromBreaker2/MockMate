# MockMate AI: Advanced AI-Powered Interview & Recruitment Platform
## Final Year Bachelor of Engineering (B.E.) Project Report

---

### Abstract
Modern technical recruitment suffers from two distinct bottlenecks: candidates lack rigorous, realistic, and personalized interview preparation environments, while recruiters spend hundreds of engineering hours conducting redundant initial screening interviews. **MockMate AI** is an end-to-end recruitment platform that bridges this divide. Built upon a modern full-stack architecture (React, Node.js, Express, TypeScript, MongoDB, and Gemini AI), MockMate AI features:
1. **Multi-Role Role-Based Access Control (RBAC)** separating Candidates, Recruiters, and Administrators.
2. **AI Resume Parser & ATS Matching Engine** that extracts structured candidate profiles from PDF documents and computes granular alignment against Job Descriptions.
3. **Adaptive Probing Technical & HR Interview Engine** leveraging Gemini 1.5 Flash/Pro with dynamic follow-up questioning and company evaluation rubrics (Google, Amazon STAR, Microsoft).
4. **Real-time Behavioral & Video Telemetry** tracking eye contact ratios, filler word frequency (um/uh/like per minute), and recording video sessions.
5. **Monaco Live Coding Sandbox** featuring multi-language execution (JavaScript, Python, C++, Java), automated test suite evaluation, and progressive 3-tier AI hint scaffolds.
6. **Recruiter & Admin Governance Suites** facilitating custom job postings, candidate pipeline analytics, and side-by-side performance comparison matrices.

---

### 1. System Architecture

```
[Candidate / Recruiter / Admin Client (React 18 + Vite + Tailwind)]
                      │ (HTTPS / WebSockets)
                      ▼
            [Nginx Reverse Proxy]
                      │
                      ▼
     [Node.js + Express + TypeScript Backend Core]
          │                │                │
          ▼                ▼                ▼
  [MongoDB Atlas]    [Redis Cache]   [Object Storage]
  (Core Schemas)    (Rate Limits)    (Videos & Resumes)
          │                │
          ▼                ▼
 [Gemini 1.5 Flash]  [Piston Runner]
 (LLM Reasoning)     (Code Sandbox)
```

---

### 2. Algorithmic Formulations

#### 2.1 ATS Match Scoring Function
The candidate alignment against a target Job Description is computed via a weighted multi-factor scoring algorithm:

$$\text{ATS Score} = w_s \cdot S_{\text{match}} + w_k \cdot K_{\text{context}} + w_e \cdot E_{\text{alignment}}$$

Where:
- $S_{\text{match}} = \frac{|S_{\text{candidate}} \cap S_{\text{required}}|}{|S_{\text{required}}|}$ (Core Technical Competency Overlap, weight $w_s = 0.60$)
- $K_{\text{context}}$ represents semantic similarity between candidate project summaries and JD responsibilities (weight $w_k = 0.25$)
- $E_{\text{alignment}}$ represents seniority/experience scaling factor (weight $w_e = 0.15$)

#### 2.2 Behavioral Telemetry (Filler Words Per Minute - FWPM)
Verbal crutch frequency is tracked continuously across the transcription stream:

$$\text{FWPM} = \frac{\sum_{i=1}^{M} \text{Count}(\text{Filler}_i)}{\Delta t_{\text{minutes}}}$$

Where verbal tokens tracked include $\text{Filler} = \{\text{um, uh, like, actually, basically, you know}\}$. An optimal interview cadence maintains $\text{FWPM} < 2.5$.

#### 2.3 Gaze Stability Ratio (Eye Contact Percentage)
The visual focus metric is computed over time samples:

$$\text{Eye Contact \%} = \frac{\int_{0}^{T} \mathbb{I}(\theta_{\text{gaze}}(t) \le \theta_{\text{threshold}}) \, dt}{T} \times 100$$

---

### 3. Database Schema Specifications

| Collection | Key Attributes | Purpose |
| :--- | :--- | :--- |
| `users` | `email`, `passwordHash`, `role`, `companyName`, `parsedSkills`, `avatarUrl` | User authentication & RBAC identity |
| `resumes` | `candidate` (FK), `rawText`, `parsedData` (JSON), `atsEvaluations` | AI-parsed resume profiles & ATS history |
| `jobpostings` | `recruiter` (FK), `title`, `department`, `requiredSkills`, `description`, `applicants` | Recruiter vacancies & candidate pipelines |
| `mockinterviews`| `user` (FK), `jobRole`, `targetCompany`, `dsaQuestions`, `overallReview`, `overallRating` | Mock interview sessions & evaluation rubrics |

---

### 4. Verification & Testing Summary

1. **Backend Service Layer**:
   - TypeScript 5.7 compile verification: 0 errors (`tsc -b`).
   - Dual token resolution verified (Cookie + Bearer auth).
   - PDF parsing and ATS scoring tested with both AI and algorithmic fallbacks.
2. **Frontend Client Layer**:
   - Vite 6.0 production build: 0 errors.
   - Bundle size optimized to ~440 kB gzip.
   - All role-protected routes (`/dashboard`, `/recruiter`, `/admin`, `/resume-ats`, `/roadmap`) verified.
3. **DevOps & Containerization**:
   - Multi-stage `Dockerfile` and `docker-compose.yml` configured for 4-tier stack (Frontend, Backend, MongoDB, Redis).
