import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { 
  Flame, 
  Trophy, 
  Map, 
  CheckCircle2, 
  Star, 
  Zap, 
  Shield, 
  BookOpen
} from "lucide-react";


export const RoadmapLeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"roadmap" | "badges" | "leaderboard">("roadmap");

  const streakDays = 5;

  const badges = [
    {
      id: "b-1",
      title: "Algorithm Specialist",
      category: "Technical",
      description: "Complete 5 technical interviews with an average score above 85%",
      unlocked: true,
      earnedDate: "2026-08-25",
      icon: Zap,
      color: "from-amber-500 to-yellow-400",
    },
    {
      id: "b-2",
      title: "Gaze Stability Pro",
      category: "Behavioral",
      description: "Maintain >85% eye contact across an entire 20-minute mock interview",
      unlocked: true,
      earnedDate: "2026-09-02",
      icon: Star,
      color: "from-emerald-500 to-teal-400",
    },
    {
      id: "b-3",
      title: "ATS 90+ Club",
      category: "Resume",
      description: "Achieve an ATS keyword match score of 90% or higher against a job vacancy",
      unlocked: true,
      earnedDate: "2026-09-04",
      icon: Trophy,
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: "b-4",
      title: "System Architect",
      category: "Technical",
      description: "Pass a full System Design round addressing caching, partitioning, and failovers",
      unlocked: false,
      icon: Shield,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "b-5",
      title: "Articulate Orator",
      category: "Behavioral",
      description: "Complete an HR behavioral round with under 2 filler words per minute",
      unlocked: false,
      icon: Flame,
      color: "from-red-500 to-orange-500",
    },
  ];

  const roadmapWeeks = [
    {
      week: 1,
      title: "Core Data Structures & Algorithmic Patterns",
      focus: "Time & Space Complexity, HashMaps, Two Pointers, and Sliding Windows",
      status: "completed",
      modules: [
        { name: "Array & String Manipulation (Kadane's Algorithm, Prefix Sums)", done: true },
        { name: "Fast & Slow Pointers (Linked List Cycle Detection, Palindromes)", done: true },
        { name: "Sliding Window Maximum & Substring Problems", done: true },
        { name: "Mock Session: Algorithmic Rigor in Python / C++", done: true },
      ],
    },
    {
      week: 2,
      title: "Trees, Graphs & Dynamic Programming",
      focus: "DFS, BFS, Topological Sort, Memoization vs. Tabulation",
      status: "in_progress",
      modules: [
        { name: "Binary Tree Traversals & Lowest Common Ancestor (LCA)", done: true },
        { name: "Graph BFS/DFS & Dijkstra's Shortest Path", done: false },
        { name: "Dynamic Programming: 0/1 Knapsack & Longest Common Subsequence", done: false },
        { name: "Mock Session: Tree & Graph Coding Round", done: false },
      ],
    },
    {
      week: 3,
      title: "System Design & Distributed Scalability",
      focus: "Horizontal Scaling, Caching, Sharding, Message Queues",
      status: "upcoming",
      modules: [
        { name: "CAP Theorem, Consistency Models & SQL vs. NoSQL Trade-offs", done: false },
        { name: "Distributed Caching (Redis eviction policies & cache-aside pattern)", done: false },
        { name: "Designing a Scalable Rate Limiter & URL Shortener", done: false },
        { name: "Mock Session: High-Level Architecture Assessment", done: false },
      ],
    },
    {
      week: 4,
      title: "Executive Behavioral & Bar Raiser Polish",
      focus: "Amazon STAR Method, Conflict Resolution, Engineering Leadership",
      status: "upcoming",
      modules: [
        { name: "Structuring Technical Conflict Stories (STAR Methodology)", done: false },
        { name: "Eliminating Filler Words & Maintaining Steady Gaze Telemetry", done: false },
        { name: "Negotiation, Reverse Questions & Company Cultural Alignment", done: false },
        { name: "Mock Session: Full 45-Minute Bar Raiser Simulation", done: false },
      ],
    },
  ];

  const leaderboardUsers = [
    { rank: 1, name: "Siddharth Menon", score: 94.8, interviews: 18, streak: 14, badge: "Master" },
    { rank: 2, name: "Pooja Hegde", score: 92.4, interviews: 15, streak: 9, badge: "Elite" },
    { rank: 3, name: user?.name || "You", score: 88.5, interviews: 12, streak: streakDays, badge: "Expert", isCurrentUser: true },
    { rank: 4, name: "Devansh Singhania", score: 86.2, interviews: 10, streak: 6, badge: "Pro" },
    { rank: 5, name: "Meera Krishnan", score: 84.1, interviews: 9, streak: 4, badge: "Pro" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-slate-100">
      <Navbar />

      <main className="container pt-28 mx-auto px-4 md:px-8 pb-16">
        {/* Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#18181b] to-purple-950/30 border border-amber-500/20 mb-8 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streakDays}-Day Practice Streak Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Personalized Growth & Gamification
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Follow your AI-generated 4-week preparation roadmap, unlock achievement badges, and climb the platform rankings.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-8">
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "roadmap"
                ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Map className="w-3.5 h-3.5 text-blue-400" />
            4-Week AI Roadmap
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "badges"
                ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "leaderboard"
                ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            Cohort Leaderboard
          </button>
        </div>

        {/* Roadmap Tab */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center justify-between text-xs text-blue-300">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                This syllabus is dynamically synthesized based on your previous interview gap analysis.
              </span>
              <span className="font-semibold text-white">Progress: 35%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmapWeeks.map((week) => (
                <div
                  key={week.week}
                  className={`p-6 rounded-2xl border transition-all ${
                    week.status === "completed"
                      ? "bg-slate-900/40 border-emerald-500/30"
                      : week.status === "in_progress"
                      ? "bg-slate-900/60 border-blue-500/40 shadow-lg shadow-blue-500/5"
                      : "bg-slate-900/20 border-slate-800/80 opacity-75"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Week {week.week}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        week.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : week.status === "in_progress"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {week.status === "completed"
                        ? "Completed"
                        : week.status === "in_progress"
                        ? "Active Focus"
                        : "Upcoming"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{week.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{week.focus}</p>

                  <div className="space-y-2 border-t border-slate-800/80 pt-3">
                    {week.modules.map((mod, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            mod.done ? "text-emerald-400" : "text-slate-600"
                          }`}
                        />
                        <span className={mod.done ? "line-through text-slate-500" : ""}>
                          {mod.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    badge.unlocked
                      ? "bg-slate-900/60 border-slate-800"
                      : "bg-slate-950/40 border-slate-900 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.color} text-slate-950 flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">{badge.title}</h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {badge.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-4">{badge.description}</p>

                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {badge.unlocked ? `Earned: ${badge.earnedDate}` : "Locked"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        badge.unlocked
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {badge.unlocked ? "UNLOCKED" : "IN PROGRESS"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-2">Cohort Interview Rankings</h3>
            <p className="text-xs text-slate-400 mb-6">
              Rankings are computed based on average AI evaluation score, interview frequency, and consistency streaks.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Rank</th>
                    <th className="px-6 py-3.5">Candidate</th>
                    <th className="px-6 py-3.5">AI Rating</th>
                    <th className="px-6 py-3.5">Interviews</th>
                    <th className="px-6 py-3.5">Streak</th>
                    <th className="px-6 py-3.5 text-right">Badge Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboardUsers.map((candidate) => (
                    <tr
                      key={candidate.rank}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        candidate.isCurrentUser ? "bg-emerald-950/20 border-l-2 border-emerald-500" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-white">
                        {candidate.rank === 1 ? "🥇 1" : candidate.rank === 2 ? "🥈 2" : candidate.rank === 3 ? "🥉 3" : `#${candidate.rank}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">
                          {candidate.name} {candidate.isCurrentUser && "(You)"}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">
                        {candidate.score}%
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {candidate.interviews} completed
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-amber-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" /> {candidate.streak} Days
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {candidate.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoadmapLeaderboardPage;
