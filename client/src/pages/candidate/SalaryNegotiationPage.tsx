import React, { useState } from "react";
import axios from "axios";
import {
  Briefcase,
  TrendingUp,
  Send,
  RotateCcw,
  Sparkles,
  Bot,
  User,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface Message {
  role: "candidate" | "hr";
  text: string;
  time: string;
}

export const SalaryNegotiationPage: React.FC = () => {
  const jobTitle = "Senior Full-Stack Engineer";
  const level = "L5 / Senior";


  // Initial Company Offer
  const [initialOffer] = useState({
    baseSalary: 145000,
    equity: 50000,
    signOnBonus: 15000,
  });

  // Candidate Counter Form
  const [counterBase, setCounterBase] = useState<number>(162000);
  const [counterEquity, setCounterEquity] = useState<number>(65000);
  const [counterBonus, setCounterBonus] = useState<number>(25000);
  const [justification, setJustification] = useState<string>(
    "Based on my 4+ years architecting high-scale distributed systems and competing interest from another Series-B firm, I'd love to see if we can adjust the base to $162k and sign-on to $25k to make this an immediate accept."
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "hr",
      text: `Hello! We were thoroughly impressed by your system design and live coding rounds. We are thrilled to extend an official offer of $145k Base Salary, $50k in 4-year RSUs, and a $15k Sign-On Bonus. We look forward to having you on the team!`,
      time: "Just now",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);

  const handleSendCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) return;

    const userMessage: Message = {
      role: "candidate",
      text: `Proposal: $${counterBase.toLocaleString()} Base | $${counterEquity.toLocaleString()} Equity | $${counterBonus.toLocaleString()} Sign-On.\n"${justification}"`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/ai/salary-negotiate`,
        {
          jobTitle,
          level,
          initialOffer,
          candidateCounter: {
            baseSalary: counterBase,
            equity: counterEquity,
            signOnBonus: counterBonus,
            justification,
          },
          conversationHistory: messages.map((m) => ({
            role: m.role === "candidate" ? "candidate" : "hr_negotiator",
            message: m.text,
          })),
        },
        { withCredentials: true }
      );

      const analysis = response.data;
      setLatestAnalysis(analysis);

      setMessages((prev) => [
        ...prev,
        {
          role: "hr",
          text: analysis.hrResponse,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Negotiation request failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 selection:bg-emerald-500 selection:text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                AI Roleplay Simulator
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
                Tier-1 HR Standards
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-2">
              AI Salary Negotiation & Offer Simulator
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Practice negotiating compensation, equity, and bonuses with our live Gemini AI HR Director.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([
                  {
                    role: "hr",
                    text: `Hello! We've prepared an initial offer for ${jobTitle} (${level}): $145k Base, $50k RSUs, $15k Sign-On. How do these numbers align with your expectations?`,
                    time: "Just now",
                  },
                ]);
                setLatestAnalysis(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Negotiation
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Offer Details & Counter-Offer Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Initial Offer Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Initial Company Offer</h3>
                </div>
                <span className="text-xs text-slate-400">{level}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Base Salary</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    ${initialOffer.baseSalary.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Equity (4-Yr)</div>
                  <div className="text-base font-bold text-blue-400 mt-0.5">
                    ${initialOffer.equity.toLocaleString()}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Sign-on</div>
                  <div className="text-base font-bold text-purple-400 mt-0.5">
                    ${initialOffer.signOnBonus.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-right text-xs text-slate-500">
                Year 1 Total Comp: <strong>${(initialOffer.baseSalary + initialOffer.equity / 4 + initialOffer.signOnBonus).toLocaleString()}</strong>
              </div>
            </div>

            {/* Counter-Offer Input Form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Propose Counter-Offer
              </h3>

              <form onSubmit={handleSendCounter} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Requested Base Salary ($)
                  </label>
                  <input
                    type="number"
                    value={counterBase}
                    onChange={(e) => setCounterBase(Number(e.target.value))}
                    step={1000}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Equity ($)
                    </label>
                    <input
                      type="number"
                      value={counterEquity}
                      onChange={(e) => setCounterEquity(Number(e.target.value))}
                      step={5000}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">
                      Sign-on Bonus ($)
                    </label>
                    <input
                      type="number"
                      value={counterBonus}
                      onChange={(e) => setCounterBonus(Number(e.target.value))}
                      step={2500}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">
                    Professional Justification (Key Leverage Point)
                  </label>
                  <textarea
                    rows={3}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Mention competing offers, key architectural skills, or specific market compensation benchmarks..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "VP of HR is analyzing..." : "Submit Counter-Offer"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive Roleplay Conversation & AI Critique (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Conversation Log */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl flex-1 flex flex-col h-[420px] overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs ${
                    m.role === "candidate" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "hr" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 ${
                      m.role === "candidate"
                        ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-100 rounded-tr-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span className="font-bold text-[11px] text-slate-400">
                        {m.role === "candidate" ? "You (Candidate)" : "VP of HR (MockMate AI)"}
                      </span>
                      <span className="text-[10px] text-slate-500">{m.time}</span>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  </div>
                  {m.role === "candidate" && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isSubmitting && (
                <div className="flex gap-2 text-xs text-slate-400 items-center animate-pulse">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <span>The compensation committee is reviewing your counter-proposal...</span>
                </div>
              )}
            </div>

            {/* AI Negotiation Scorecard & Next Move */}
            {latestAnalysis && (
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 shadow-xl text-xs backdrop-blur-md animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-bold text-white">AI Negotiation Scorecard</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      Tact Score: <strong className="text-emerald-400">{latestAnalysis.tactScore}%</strong>
                    </span>
                    <span className="text-slate-400">
                      Market Realism: <strong className="text-blue-400">{latestAnalysis.marketCompetitivenessScore}%</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <p>
                    <strong className="text-white">Critique:</strong> {latestAnalysis.critique}
                  </p>
                  <p className="text-indigo-300">
                    <strong>Recommended Next Move:</strong> {latestAnalysis.recommendedNextMove}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalaryNegotiationPage;
