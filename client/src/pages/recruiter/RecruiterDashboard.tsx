import React, { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { 
  Briefcase, 
  Users, 
  Video, 
  Award, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  Search,
  Filter
} from "lucide-react";


import { useNotification } from "@/components/Notifications/NotificationContext";
import { createJobPosting, getRecruiterJobs } from "@/api/job.api";

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "candidates" | "comparison">("overview");

  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("");
  const [newJobSkills, setNewJobSkills] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [liveJobs, setLiveJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    try {
      const data = await getRecruiterJobs();
      if (data && data.length > 0) {
        setLiveJobs(data);
      }
    } catch {
      // Keep mock fallback
    }
  };

  const handleCreateJob = async () => {
    if (!newJobTitle.trim() || !newJobDept.trim() || !newJobDesc.trim()) {
      addNotification({
        id: Date.now().toString(),
        type: "warning",
        message: "Please fill in title, department, and description",
      });
      return;
    }

    try {
      setIsCreatingJob(true);
      const skillsArray = newJobSkills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await createJobPosting({
        title: newJobTitle.trim(),
        department: newJobDept.trim(),
        experienceLevel: "Senior",
        requiredSkills: skillsArray,
        description: newJobDesc.trim(),
        targetCompany: user?.companyName || "Tech Enterprise",
      });

      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Job posting published successfully!",
      });

      setLiveJobs((prev) => [res.job, ...prev]);
      setNewJobTitle("");
      setNewJobDept("");
      setNewJobSkills("");
      setNewJobDesc("");
      setActiveTab("overview");
    } catch (err: any) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: err.response?.data?.message || "Failed to create job posting",
      });
    } finally {
      setIsCreatingJob(false);
    }
  };

  // Sample data for initial layout visualization
  const mockJobs = liveJobs.length > 0 ? liveJobs.map(j => ({
    id: j._id,
    title: j.title,
    department: j.department,
    applicantsCount: j.applicants?.length || 0,
    interviewedCount: Math.round((j.applicants?.length || 0) * 0.6),
    status: j.status === "active" ? "Active" : "Closed",
    experienceLevel: j.experienceLevel,
    createdAt: new Date(j.createdAt || Date.now()).toISOString().split("T")[0]
  })) : [

    {
      id: "job-1",
      title: "Senior Full Stack Engineer (MERN)",
      department: "Core Engineering",
      applicantsCount: 14,
      interviewedCount: 8,
      status: "Active",
      experienceLevel: "Senior",
      createdAt: "2026-08-28",
    },
    {
      id: "job-2",
      title: "Backend Platform Engineer (Node.js & Go)",
      department: "Infrastructure",
      applicantsCount: 9,
      interviewedCount: 5,
      status: "Active",
      experienceLevel: "Mid-Level",
      createdAt: "2026-09-01",
    },
    {
      id: "job-3",
      title: "AI / ML Solutions Engineer",
      department: "Data & AI",
      applicantsCount: 22,
      interviewedCount: 12,
      status: "Active",
      experienceLevel: "Senior",
      createdAt: "2026-08-15",
    },
  ];

  const mockCandidates = [
    {
      id: "cand-1",
      name: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      jobRole: "Senior Full Stack Engineer (MERN)",
      atsScore: 89,
      overallScore: 85,
      communicationScore: 88,
      status: "Interviewed",
      completedAt: "2026-09-03",
    },
    {
      id: "cand-2",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      jobRole: "AI / ML Solutions Engineer",
      atsScore: 94,
      overallScore: 91,
      communicationScore: 92,
      status: "Shortlisted",
      completedAt: "2026-09-04",
    },
    {
      id: "cand-3",
      name: "Rohan Verma",
      email: "rohan.v@example.com",
      jobRole: "Backend Platform Engineer",
      atsScore: 78,
      overallScore: 74,
      communicationScore: 80,
      status: "Under Review",
      completedAt: "2026-09-02",
    },
  ];

  return (
    <div className="min-h-screen bg-[#121214] text-slate-100">
      <Navbar />

      <main className="container pt-28 mx-auto px-4 md:px-8 pb-16">
        {/* Recruiter Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#18181b] to-emerald-900/20 border border-emerald-500/20 mb-8 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Recruiter Portal
              </span>
              <span className="text-xs text-slate-400">
                {user?.companyName || "Organization Workspace"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || "Recruiter"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage custom interview rounds, evaluate candidate AI scorecards, and review candidate videos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab("jobs")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Interview Round
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "jobs"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Job Postings & Rounds ({mockJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("candidates")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "candidates"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Candidate Pipeline ({mockCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "comparison"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Side-by-Side Comparison
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Openings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">3</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> 2 created this month
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Applicants</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">45</div>
            <div className="text-xs text-blue-400 flex items-center gap-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> 18 new candidates
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Interviews Finished</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">25</div>
            <div className="text-xs text-purple-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% evaluated by AI
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Shortlisted</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">8</div>
            <div className="text-xs text-amber-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> 32% qualification rate
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Rounds Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Active Interview Rounds</h3>
                <button 
                  onClick={() => setActiveTab("jobs")}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {mockJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-base">{job.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-3">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>Level: {job.experienceLevel}</span>
                        <span>•</span>
                        <span>Created: {job.createdAt}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-300">
                      <div className="text-right">
                        <div className="font-semibold text-white">{job.applicantsCount}</div>
                        <div className="text-slate-400">Applicants</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-400">{job.interviewedCount}</div>
                        <div className="text-slate-400">Interviewed</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recommended Candidates */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Top Evaluated Candidates</h3>
                <button 
                  onClick={() => setActiveTab("candidates")}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {mockCandidates.map((c) => (
                  <div 
                    key={c.id} 
                    className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-white text-sm">{c.name}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">{c.jobRole}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.overallScore}% AI Score
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs">
                      <div>
                        <span className="text-slate-400">ATS Match: </span>
                        <span className="font-medium text-white">{c.atsScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Comm: </span>
                        <span className="font-medium text-white">{c.communicationScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "candidates" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search candidate name, email, or skill..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white">
                  <Filter className="w-3.5 h-3.5" /> Filter by ATS &gt; 80%
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Candidate</th>
                    <th className="px-6 py-3.5">Target Role</th>
                    <th className="px-6 py-3.5">ATS Score</th>
                    <th className="px-6 py-3.5">AI Interview Score</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {mockCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{candidate.name}</div>
                        <div className="text-xs text-slate-400">{candidate.email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-200">
                        {candidate.jobRole}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {candidate.atsScore}% Match
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {candidate.overallScore}% Overall
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700">
                          {candidate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer">
                          View Report & Video
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Create New Job Assessment Round</h3>
              <p className="text-xs text-slate-400 mb-6">
                Upload a Job Description or define key requirements to let Gemini AI generate custom technical and behavioral interview questions tailored to your vacancy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Frontend Architect" 
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Frontend Engineering" 
                    value={newJobDept}
                    onChange={(e) => setNewJobDept(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-300 mb-1">Required Skills (comma-separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. React, TypeScript, GraphQL, Next.js, WebSockets" 
                  value={newJobSkills}
                  onChange={(e) => setNewJobSkills(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Description & Competencies</label>
                <textarea 
                  rows={4} 
                  placeholder="Paste the full JD or required tech stack..." 
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button 
                onClick={handleCreateJob}
                disabled={isCreatingJob}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium text-sm transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isCreatingJob ? "Generating AI Assessment..." : "Publish Job Opening & Assessment Blueprint"}
              </button>

            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-6">
            <h3 className="text-lg font-semibold text-white">Side-by-Side Candidate Comparison</h3>
            <p className="text-xs text-slate-400">
              Select 2 to 3 candidates to compare their ATS score, coding performance, Big-O awareness, and behavioral telemetry side-by-side.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCandidates.slice(0, 2).map((cand) => (
                <div key={cand.id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-base">{cand.name}</h4>
                      <p className="text-xs text-slate-400">{cand.jobRole}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Score: {cand.overallScore}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/40">
                      <span className="text-slate-400">ATS Resume Match:</span>
                      <span className="font-semibold text-blue-400">{cand.atsScore}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/40">
                      <span className="text-slate-400">Technical Competence:</span>
                      <span className="font-semibold text-white">{cand.overallScore + 2}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/40">
                      <span className="text-slate-400">Communication & Confidence:</span>
                      <span className="font-semibold text-white">{cand.communicationScore}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/40">
                      <span className="text-slate-400">Eye Contact & Gaze Ratio:</span>
                      <span className="font-semibold text-emerald-400">88%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/40">
                      <span className="text-slate-400">Filler Words Per Minute:</span>
                      <span className="font-semibold text-amber-400">2.1 (Low)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
