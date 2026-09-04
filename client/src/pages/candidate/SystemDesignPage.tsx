import React from "react";
import Navbar from "@/components/Navbar";
import SystemDesignWhiteboard from "@/components/SystemDesignWhiteboard";
import { ShieldCheck, Cpu, HardDrive } from "lucide-react";

export const SystemDesignPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Interactive Architecture Lab
              </span>
              <span className="text-xs text-slate-400">FAANG / Tier-1 Interview Prep</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-2">
              System Design Whiteboard & AI Architect
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Design distributed architectures with drag-and-drop cloud components and receive instant AI evaluation on scalability, single points of failure, and bottleneck risks.
            </p>
          </div>
        </div>

        {/* System Design Whiteboard Component */}
        <div className="mb-8">
          <SystemDesignWhiteboard />
        </div>

        {/* Distributed Systems Primer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
              <Cpu className="w-4 h-4" /> Scalability & High Availability
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decouple stateless web tiers behind horizontal Load Balancers and employ Auto-Scaling Groups to handle irregular traffic spikes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4" /> Eliminating SPOFs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Always ensure primary databases have automated read-replicas with multi-AZ failovers, and place queues between producer and worker tiers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold text-blue-400 flex items-center gap-1.5 mb-1.5">
              <HardDrive className="w-4 h-4" /> In-Memory Cache Layers
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilize Redis or Memcached with Least Recently Used (LRU) eviction policies to offload 80%+ of repetitive read queries from persistent disk storage.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemDesignPage;
