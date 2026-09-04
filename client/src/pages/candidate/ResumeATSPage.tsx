import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { 
  uploadResume, 
  getCandidateResume, 
  evaluateATS, 
  ParsedResume, 
  ATSEvaluationResponse 
} from "@/api/resume.api";
import { getAllJobs, JobPosting } from "@/api/job.api";
import { createInterview } from "@/api/mockinterview.api";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  ArrowRight,
  RefreshCw,
  Award
} from "lucide-react";

export const ResumeATSPage: React.FC = () => {
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [customJobTitle, setCustomJobTitle] = useState<string>("");
  const [customSkills, setCustomSkills] = useState<string>("");
  const [customJobDesc, setCustomJobDesc] = useState<string>("");

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<ATSEvaluationResponse["evaluation"] | null>(null);

  useEffect(() => {
    fetchExistingResume();
    fetchJobs();
  }, []);

  const fetchExistingResume = async () => {
    try {
      const data = await getCandidateResume();
      setResume(data);
      if (data.atsEvaluations && data.atsEvaluations.length > 0) {
        const latest = data.atsEvaluations[0];
        setEvaluationResult({
          matchScore: latest.matchScore,
          matchedSkills: latest.matchedSkills,
          missingSkills: latest.missingSkills,
          recommendations: latest.recommendations,
          summary: `Previous evaluation for ${latest.jobTitle}`,
        });
      }
    } catch {
      // No resume yet, ignore
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
      if (data.length > 0) {
        setSelectedJobId(data[0]._id);
      }
    } catch (e) {
      console.error("Error fetching jobs", e);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Please select a PDF document.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setIsUploading(true);
      const res = await uploadResume(formData);
      setResume(res.resume);
      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Resume parsed successfully by Gemini AI!",
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: error.response?.data?.message || "Failed to parse resume",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunATSEvaluation = async () => {
    if (!resume) {
      addNotification({
        id: Date.now().toString(),
        type: "warning",
        message: "Please upload your resume first.",
      });
      return;
    }

    try {
      setIsEvaluating(true);
      let payload: any = {};

      if (selectedJobId && selectedJobId !== "custom") {
        payload.jobId = selectedJobId;
      } else {
        if (!customJobTitle.trim() || !customJobDesc.trim()) {
          addNotification({
            id: Date.now().toString(),
            type: "warning",
            message: "Please provide both a Job Title and Description",
          });
          setIsEvaluating(false);
          return;
        }
        payload = {
          jobTitle: customJobTitle.trim(),
          description: customJobDesc.trim(),
          requiredSkills: customSkills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
      }

      const res = await evaluateATS(payload);
      setEvaluationResult(res.evaluation);
      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: `ATS Evaluation Complete: ${res.evaluation.matchScore}% Match!`,
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: error.response?.data?.message || "ATS Evaluation failed",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleStartTailoredInterview = async () => {
    try {
      let role = "Full Stack Engineer";
      let company = "Tech Enterprise";
      let skills = resume?.parsedData.skills || ["React", "Node.js"];

      if (selectedJobId && selectedJobId !== "custom") {
        const job = jobs.find((j) => j._id === selectedJobId);
        if (job) {
          role = job.title;
          company = job.targetCompany || "Enterprise";
          skills = job.requiredSkills.length > 0 ? job.requiredSkills : skills;
        }
      } else if (customJobTitle) {
        role = customJobTitle;
        skills = customSkills.split(",").map((s) => s.trim()).filter(Boolean);
      }

      const interview = await createInterview({
        jobRole: role,
        experienceLevel: "Mid-Level",
        skills,
        targetCompany: company,
        overallReview: "",
        overallRating: 0,
        dsaQuestions: [],
        technicalQuestions: [],
        coreSubjectQuestions: [],
      });

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Tailored interview session prepared!",
      });

      navigate(`/interviewinterface/${(interview as any)._id || (interview as any).interview?._id}`);
    } catch (err) {
      console.error("Failed to start tailored interview", err);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-slate-100">
      <Navbar />

      <main className="container pt-28 mx-auto px-4 md:px-8 pb-16">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#18181b] to-emerald-950/30 border border-blue-500/20 mb-8 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Resume Parser & ATS Matching
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Resume Intelligence & ATS Matcher
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Upload your resume for deep AI skill extraction, compare against live vacancies, and obtain tailored improvement insights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Upload & Parsed Resume (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upload Box */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Upload Resume (PDF)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Gemini AI will extract your competencies, projects, and work history.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-950/40"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  {isUploading ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <div className="text-sm font-semibold text-white">
                  {isUploading ? "Parsing with Gemini AI..." : "Click or drag resume here"}
                </div>
                <div className="text-xs text-slate-500 mt-1">PDF format up to 10MB</div>
              </div>

              {resume && (
                <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-slate-200 font-medium truncate">
                      {resume.originalFileName}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Parsed
                  </span>
                </div>
              )}
            </div>

            {/* Parsed Profile Overview */}
            {resume && (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {resume.parsedData.fullName || "Candidate Profile"}
                    </h3>
                    <p className="text-xs text-slate-400">{resume.parsedData.email || "No email listed"}</p>
                  </div>
                  {typeof resume.parsedData.experienceYears === "number" && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {resume.parsedData.experienceYears} Years Exp
                    </span>
                  )}
                </div>

                {/* Summary */}
                {resume.parsedData.summary && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Professional Summary
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {resume.parsedData.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Extracted Skills ({resume.parsedData.skills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {resume.parsedData.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: ATS Target Job & Live Match Scorecard (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Job Selection / Custom JD */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Select Target Position for ATS Evaluation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Choose Live Job Opening
                  </label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title} • {j.department} ({j.experienceLevel})
                      </option>
                    ))}
                    <option value="custom">+ Evaluate Against Custom Job Description</option>
                  </select>
                </div>
              </div>

              {selectedJobId === "custom" && (
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Backend Engineer"
                      value={customJobTitle}
                      onChange={(e) => setCustomJobTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Required Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Node.js, PostgreSQL, Docker, AWS, Microservices"
                      value={customSkills}
                      onChange={(e) => setCustomSkills(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Job Description</label>
                    <textarea
                      rows={4}
                      placeholder="Paste the target job description requirements here..."
                      value={customJobDesc}
                      onChange={(e) => setCustomJobDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleRunATSEvaluation}
                disabled={isEvaluating || !resume}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating ATS Alignment with Gemini AI...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    Run AI ATS Match Calculation
                  </>
                )}
              </button>
            </div>

            {/* ATS Score Results Card */}
            {evaluationResult && (
              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> ATS Optimization Score
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">Candidate Match Result</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{evaluationResult.summary}</p>
                  </div>

                  {/* Score Badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-emerald-400 leading-none">
                        {evaluationResult.matchScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                        Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Matched Skills */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Matched Skills ({evaluationResult.matchedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluationResult.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                      {evaluationResult.matchedSkills.length === 0 && (
                        <span className="text-xs text-slate-500">No overlapping skills detected.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20">
                    <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      Missing Competencies ({evaluationResult.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {evaluationResult.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                      {evaluationResult.missingSkills.length === 0 && (
                        <span className="text-xs text-emerald-400">All required skills present!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    AI Suggestions to Boost Match Score
                  </h4>
                  <div className="space-y-2">
                    {evaluationResult.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA: Launch Tailored Interview */}
                <div className="pt-2">
                  <button
                    onClick={handleStartTailoredInterview}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Start Tailored Mock Interview for this Role
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeATSPage;
