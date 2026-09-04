import React from "react";
import { Bot, Mic, Sparkles, Volume2 } from "lucide-react";
import AudioWaveform from "./AudioWaveform";

export type AIAvatarState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING";

interface AIAvatarProps {
  state: AIAvatarState;
  interviewerName?: string;
  targetCompany?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  state,
  interviewerName = "MockMate AI",
  targetCompany = "Enterprise Mode",
}) => {
  const getStateBadge = () => {
    switch (state) {
      case "SPEAKING":
        return {
          label: "Speaking Question",
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          icon: <Volume2 className="w-3.5 h-3.5 animate-pulse" />,
        };
      case "THINKING":
        return {
          label: "Evaluating Response...",
          color: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          icon: <Sparkles className="w-3.5 h-3.5 animate-spin" />,
        };
      case "LISTENING":
        return {
          label: "Listening to Candidate",
          color: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          icon: <Mic className="w-3.5 h-3.5 animate-bounce" />,
        };
      default:
        return {
          label: "Ready",
          color: "bg-slate-800 text-slate-400 border-slate-700",
          icon: <Bot className="w-3.5 h-3.5" />,
        };
    }
  };

  const badge = getStateBadge();

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md text-center overflow-hidden">
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl transition-colors duration-700 pointer-events-none opacity-40 ${
          state === "SPEAKING"
            ? "bg-emerald-500"
            : state === "THINKING"
            ? "bg-amber-500"
            : state === "LISTENING"
            ? "bg-blue-500"
            : "bg-slate-700"
        }`}
      />

      {/* Holographic Avatar Circle */}
      <div className="relative my-3">
        {/* Pulsing Outer Rings */}
        <div
          className={`absolute inset-0 rounded-full scale-125 transition-all duration-500 ${
            state === "SPEAKING"
              ? "border-2 border-emerald-500/50 animate-ping opacity-75"
              : state === "LISTENING"
              ? "border-2 border-blue-500/50 animate-pulse"
              : "opacity-0"
          }`}
        />

        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 border-2 border-slate-700/80 p-1 flex items-center justify-center shadow-xl">
          <div className="w-full h-full rounded-full bg-slate-950/80 flex items-center justify-center overflow-hidden relative group">
            <Bot
              className={`w-12 h-12 transition-all duration-300 ${
                state === "SPEAKING"
                  ? "text-emerald-400 scale-110"
                  : state === "THINKING"
                  ? "text-amber-400 rotate-6"
                  : state === "LISTENING"
                  ? "text-blue-400"
                  : "text-slate-400"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Name and Target Company */}
      <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 mt-1">
        {interviewerName}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          AI
        </span>
      </h3>
      <p className="text-xs text-slate-400 mt-0.5">{targetCompany}</p>

      {/* Live State Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mt-3 transition-colors duration-300 ${badge.color}`}
      >
        {badge.icon}
        {badge.label}
      </div>

      {/* Embedded Audio Waveform */}
      <div className="mt-4 w-full flex justify-center">
        <AudioWaveform
          isActive={state !== "IDLE"}
          isSpeaking={state === "SPEAKING"}
          color={state === "SPEAKING" ? "#10b981" : state === "LISTENING" ? "#3b82f6" : "#f59e0b"}
        />
      </div>
    </div>
  );
};

export default AIAvatar;
