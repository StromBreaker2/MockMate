import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { 
  ShieldAlert, 
  Cpu, 
  Users, 
  Activity, 
  Zap, 
  DollarSign,
  Search
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");


  const mockUsers = [
    {
      id: "u-1",
      name: "Sushant Koul",
      email: "sushant@example.com",
      role: "admin",
      status: "Active",
      interviewsCount: 12,
      joinedDate: "2026-08-01",
    },
    {
      id: "u-2",
      name: "TechHire Talent Partners",
      email: "hiring@techhire.io",
      role: "recruiter",
      status: "Verified",
      interviewsCount: 45,
      joinedDate: "2026-08-15",
    },
    {
      id: "u-3",
      name: "Ananya Deshmukh",
      email: "ananya.d@example.com",
      role: "candidate",
      status: "Active",
      interviewsCount: 6,
      joinedDate: "2026-09-01",
    },
    {
      id: "u-4",
      name: "GlobalCloud Recruiting",
      email: "contact@globalcloud.com",
      role: "recruiter",
      status: "Pending Approval",
      interviewsCount: 0,
      joinedDate: "2026-09-04",
    },
  ];

  return (
    <div className="min-h-screen bg-[#101012] text-slate-100">
      <Navbar />

      <main className="container pt-28 mx-auto px-4 md:px-8 pb-16">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-red-950/30 via-[#18181b] to-purple-950/20 border border-red-500/20 mb-8 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Platform Admin Suite
              </span>
              <span className="text-xs text-slate-400">System Monitoring & RBAC</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              MockMate AI Infrastructure Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time platform metrics, AI token consumption telemetry, and multi-tenant user administration.
            </p>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Platform Users</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white">1,248</div>
            <div className="text-xs text-blue-400 mt-1">892 Candidates • 356 Recruiters</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interviews Generated</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">3,890</div>
            <div className="text-xs text-emerald-400 mt-1">94.2% completion rate</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gemini Tokens (30d)</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white">4.2M</div>
            <div className="text-xs text-purple-400 mt-1">Avg 1.2k tokens/round</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estimated API Spend</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">$14.80</div>
            <div className="text-xs text-amber-400 mt-1">Flash 1.5 & 2.0 optimized</div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 mb-8">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" /> Live Microservice Health
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Express Core API</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 99.98%
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">MongoDB Atlas</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Connected
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Gemini AI LLM</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 240ms Latency
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Code Runner (Piston)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Operational
              </span>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Platform User Administration</h3>
              <p className="text-xs text-slate-400">Manage candidate accounts, review recruiter credentials, and toggle account states.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search user name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Interviews</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        u.role === "admin" 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : u.role === "recruiter"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs font-medium text-slate-300">
                      {u.interviewsCount} sessions
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">
                      {u.joinedDate}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.status === "Pending Approval"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-200"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {u.status === "Pending Approval" ? (
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer">
                          Approve Recruiter
                        </button>
                      ) : (
                        <button className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer">
                          Edit Permissions
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
