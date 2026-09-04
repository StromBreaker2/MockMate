import React, { useState } from "react";
import axios from "axios";
import {
  Server,
  Database,
  Layers,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  HardDrive,
  Radio,
  ArrowRight,
} from "lucide-react";

export interface CanvasNode {
  id: string;
  type: "client" | "api_gateway" | "load_balancer" | "microservice" | "cache" | "queue" | "database" | "storage";
  label: string;
  x: number;
  y: number;
}

export interface CanvasEdge {
  id: string;
  from: string;
  to: string;
}

export interface ArchitectureEvaluation {
  architectureScore: number;
  scalabilityRating: string;
  singlePointsOfFailure: string[];
  bottlenecks: string[];
  strengths: string[];
  recommendedImprovements: string[];
  aiSummary: string;
}

const PRESET_TEMPLATES = [
  {
    name: "Scalable URL Shortener",
    problem: "Design a high-throughput URL shortening service (like TinyURL) supporting 100M daily writes.",
    nodes: [
      { id: "1", type: "client" as const, label: "Client Apps", x: 40, y: 120 },
      { id: "2", type: "load_balancer" as const, label: "NGINX Load Balancer", x: 220, y: 120 },
      { id: "3", type: "microservice" as const, label: "URL Redirection Service", x: 420, y: 70 },
      { id: "4", type: "microservice" as const, label: "Key Generation Service", x: 420, y: 180 },
      { id: "5", type: "cache" as const, label: "Redis Cluster (Cache)", x: 640, y: 70 },
      { id: "6", type: "database" as const, label: "MongoDB (URLs Store)", x: 640, y: 180 },
    ],
    edges: [
      { id: "e1", from: "1", to: "2" },
      { id: "e2", from: "2", to: "3" },
      { id: "e3", from: "2", to: "4" },
      { id: "e4", from: "3", to: "5" },
      { id: "e5", from: "3", to: "6" },
      { id: "e6", from: "4", to: "6" },
    ],
  },
  {
    name: "E-Commerce Order Pipeline",
    problem: "Design an asynchronous event-driven order processing engine with zero loss under flash sales.",
    nodes: [
      { id: "1", type: "client" as const, label: "Mobile / Web Shoppers", x: 40, y: 120 },
      { id: "2", type: "api_gateway" as const, label: "Kong API Gateway", x: 220, y: 120 },
      { id: "3", type: "microservice" as const, label: "Order Service", x: 400, y: 120 },
      { id: "4", type: "queue" as const, label: "Apache Kafka Queue", x: 580, y: 120 },
      { id: "5", type: "microservice" as const, label: "Payment & Inventory Workers", x: 760, y: 120 },
      { id: "6", type: "database" as const, label: "PostgreSQL (ACID Orders)", x: 760, y: 220 },
    ],
    edges: [
      { id: "e1", from: "1", to: "2" },
      { id: "e2", from: "2", to: "3" },
      { id: "e3", from: "3", to: "4" },
      { id: "e4", from: "4", to: "5" },
      { id: "e5", from: "5", to: "6" },
    ],
  },
];

export const SystemDesignWhiteboard: React.FC = () => {
  const [nodes, setNodes] = useState<CanvasNode[]>(PRESET_TEMPLATES[0].nodes);
  const [edges, setEdges] = useState<CanvasEdge[]>(PRESET_TEMPLATES[0].edges);
  const [problemStatement, setProblemStatement] = useState<string>(PRESET_TEMPLATES[0].problem);
  const [selectedFromNode, setSelectedFromNode] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<ArchitectureEvaluation | null>(null);

  const addNode = (type: CanvasNode["type"], defaultLabel: string) => {
    const newNode: CanvasNode = {
      id: Date.now().toString(),
      type,
      label: `${defaultLabel} #${nodes.length + 1}`,
      x: 100 + (nodes.length % 5) * 120,
      y: 80 + Math.floor(nodes.length / 5) * 90,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
  };

  const handleNodeClick = (id: string) => {
    if (!selectedFromNode) {
      setSelectedFromNode(id);
    } else if (selectedFromNode === id) {
      setSelectedFromNode(null);
    } else {
      // Connect nodes
      const existing = edges.find((e) => e.from === selectedFromNode && e.to === id);
      if (!existing) {
        setEdges((prev) => [...prev, { id: `${selectedFromNode}-${id}`, from: selectedFromNode, to: id }]);
      }
      setSelectedFromNode(null);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/ai/evaluate-system-design`,
        {
          problemStatement,
          nodes,
          edges,
        },
        { withCredentials: true }
      );
      setEvaluation(response.data);
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const loadTemplate = (idx: number) => {
    setNodes(PRESET_TEMPLATES[idx].nodes);
    setEdges(PRESET_TEMPLATES[idx].edges);
    setProblemStatement(PRESET_TEMPLATES[idx].problem);
    setEvaluation(null);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl text-slate-100">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Interactive System Design Whiteboard</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              AI Evaluated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{problemStatement}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_TEMPLATES.map((tpl, i) => (
            <button
              key={tpl.name}
              onClick={() => loadTemplate(i)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              Load {tpl.name.split(" ")[0]}
            </button>
          ))}
          <button
            onClick={() => {
              setNodes([]);
              setEdges([]);
              setEvaluation(null);
            }}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-red-400"
            title="Clear Whiteboard"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating || nodes.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isEvaluating ? "Analyzing..." : "Evaluate Architecture with AI"}
          </button>
        </div>
      </div>

      {/* Node Toolbar */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto border-b border-slate-800/60">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">Add Building Blocks:</span>
        <button
          onClick={() => addNode("load_balancer", "Load Balancer")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-emerald-400"
        >
          <Cpu className="w-3 h-3" /> + Load Balancer
        </button>
        <button
          onClick={() => addNode("api_gateway", "API Gateway")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-blue-400"
        >
          <Server className="w-3 h-3" /> + API Gateway
        </button>
        <button
          onClick={() => addNode("microservice", "Microservice")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-purple-400"
        >
          <Layers className="w-3 h-3" /> + Microservice
        </button>
        <button
          onClick={() => addNode("cache", "Redis Cache")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-red-400"
        >
          <Radio className="w-3 h-3" /> + Redis Cache
        </button>
        <button
          onClick={() => addNode("queue", "Kafka Queue")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-amber-400"
        >
          <Play className="w-3 h-3" /> + Message Queue
        </button>
        <button
          onClick={() => addNode("database", "Database")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-cyan-400"
        >
          <Database className="w-3 h-3" /> + Database
        </button>
        <button
          onClick={() => addNode("storage", "S3 Storage")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300"
        >
          <HardDrive className="w-3 h-3" /> + S3 Storage
        </button>
      </div>

      {/* Whiteboard Interactive Canvas */}
      <div className="relative w-full h-80 bg-slate-950/90 rounded-xl my-4 border border-slate-800/80 overflow-hidden shadow-inner flex flex-wrap gap-4 p-4 content-start">
        {nodes.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <Layers className="w-8 h-8 mb-2 opacity-40" />
            Click buttons above to add architectural components or load a template.
          </div>
        ) : (
          nodes.map((node) => {
            const isSelected = selectedFromNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none shadow-md ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-500/50 scale-105"
                    : "border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-850"
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-800/80">
                  {node.type === "load_balancer" ? (
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  ) : node.type === "api_gateway" ? (
                    <Server className="w-4 h-4 text-blue-400" />
                  ) : node.type === "cache" ? (
                    <Radio className="w-4 h-4 text-red-400" />
                  ) : node.type === "queue" ? (
                    <Play className="w-4 h-4 text-amber-400" />
                  ) : node.type === "database" ? (
                    <Database className="w-4 h-4 text-cyan-400" />
                  ) : node.type === "storage" ? (
                    <HardDrive className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Layers className="w-4 h-4 text-purple-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{node.label}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{node.type.replace("_", " ")}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                  className="ml-2 text-slate-600 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Active Data Flows / Connections */}
      {edges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-500">Connected Flows:</span>
          {edges.map((e) => {
            const fromLabel = nodes.find((n) => n.id === e.from)?.label || "Node";
            const toLabel = nodes.find((n) => n.id === e.to)?.label || "Node";
            return (
              <span
                key={e.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
              >
                {fromLabel} <ArrowRight className="w-3 h-3 text-indigo-400" /> {toLabel}
              </span>
            );
          })}
        </div>
      )}

      {/* AI Architectural Evaluation Results */}
      {evaluation && (
        <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">AI Architectural Critique & Scalability Score</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Scalability: <strong className="text-emerald-400">{evaluation.scalabilityRating}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-sm font-bold">
                {evaluation.architectureScore} / 100
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic mb-4">"{evaluation.aiSummary}"</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Strengths */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4" /> Architectural Strengths
              </h4>
              <ul className="space-y-1 text-slate-300">
                {evaluation.strengths.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            {/* SPOFs & Bottlenecks */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" /> Single Points of Failure & Bottlenecks
              </h4>
              <ul className="space-y-1 text-slate-300">
                {evaluation.singlePointsOfFailure.map((spof, i) => (
                  <li key={i} className="text-red-300">• SPOF: {spof}</li>
                ))}
                {evaluation.bottlenecks.map((b, i) => (
                  <li key={i} className="text-amber-300">• Bottleneck: {b}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Upgrades */}
          <div className="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <h4 className="font-semibold text-indigo-400 mb-1.5">Recommended Architect Upgrades:</h4>
            <ul className="space-y-1 text-slate-300">
              {evaluation.recommendedImprovements.map((imp, i) => (
                <li key={i}>→ {imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDesignWhiteboard;
