"use client";

import { useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { usePiston, TestCase } from "../../utils/hooks/usePiston";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Share2, 
  RotateCcw, 
  Cpu, 
  Terminal 
} from "lucide-react";

// Boilerplate starters per language
const CODE_BOILERPLATES: Record<string, string> = {
  JavaScript: `// JavaScript (Node.js 18)
function solution(input) {
  // Solve problem here
  return input;
}

const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(solution(input));`,

  Python: `# Python 3.10
import sys

def solution(data):
    # Solve problem here
    return data

if __name__ == "__main__":
    input_data = sys.stdin.read().strip()
    print(solution(input_data))`,

  "C++": `// C++ 17
#include <iostream>
#include <string>
#include <vector>

using namespace std;

int main() {
    string input;
    if (cin >> input) {
        cout << input << endl;
    }
    return 0;
}`,

  Java: `// Java 15
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            System.out.println(scanner.nextLine());
        }
    }
}`,

  TypeScript: `// TypeScript
import * as fs from "fs";

function solve(input: string): string {
  return input;
}

const input = fs.readFileSync(0, "utf-8").trim();
console.log(solve(input));`,
};

const getPistonLanguage = (language: string): "cpp" | "javascript" | "typescript" | "python3" | "java" => {
  const map: Record<string, "cpp" | "javascript" | "typescript" | "python3" | "java"> = {
    "C++": "cpp",
    JavaScript: "javascript",
    TypeScript: "typescript",
    Python: "python3",
    Java: "java",
  };
  return map[language] || "javascript";
};

export default function CodeEditor() {
  const [language, setLanguage] = useState<string>("JavaScript");
  const [code, setCode] = useState<string>(CODE_BOILERPLATES["JavaScript"]);
  const [customInput, setCustomInput] = useState("");
  const [activeTab, setActiveTab] = useState<"output" | "testcases" | "hints">("output");
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(0);

  const sampleTestCases: TestCase[] = [
    { input: "4\n1 2 3 4", expectedOutput: "4\n1 2 3 4" },
    { input: "hello", expectedOutput: "hello" },
  ];

  const editorRef = useRef<any>(null);
  const { runCode, runTestCases, output, error, isLoading, testResults } = usePiston();

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(CODE_BOILERPLATES[newLang] || "// Start coding here");
  };

  const handleRunCustomCode = () => {
    setActiveTab("output");
    runCode(code, getPistonLanguage(language), customInput);
  };

  const handleRunAllTests = () => {
    setActiveTab("testcases");
    runTestCases(code, getPistonLanguage(language), sampleTestCases);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0e0e10] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Terminal className="w-3.5 h-3.5" />
            Monaco Sandbox
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {["JavaScript", "TypeScript", "Python", "Java", "C++"].map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCode(CODE_BOILERPLATES[language])}
            title="Reset code template"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCustomCode}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            {isLoading ? "Running..." : "Run"}
          </button>

          <button
            onClick={handleRunAllTests}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Run Test Cases
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Monaco Editor (7 cols) */}
        <div className="lg:col-span-7 h-full border-r border-slate-800 flex flex-col">
          <Editor
            height="100%"
            theme="vs-dark"
            language={getPistonLanguage(language)}
            value={code}
            onChange={(val) => setCode(val || "")}
            onMount={(editor) => (editorRef.current = editor)}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "Fira Code, Menlo, Monaco, monospace",
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              tabSize: 2,
            }}
          />
        </div>

        {/* Console / Output & Test Suites (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-[#0a0a0c]">
          {/* Tabs Header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("output")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === "output"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Console Output
            </button>
            <button
              onClick={() => setActiveTab("testcases")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "testcases"
                  ? "bg-slate-800 text-emerald-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Test Cases ({testResults.length || sampleTestCases.length})
            </button>
            <button
              onClick={() => setActiveTab("hints")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "hints"
                  ? "bg-slate-800 text-amber-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              AI Hints
            </button>
          </div>

          {/* Tab Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeTab === "output" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Standard Input (stdin)
                  </label>
                  <textarea
                    rows={3}
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter runtime inputs here..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Terminal Output
                    </label>
                    <span className="text-[10px] text-slate-500">Piston Sandbox Runner</span>
                  </div>
                  <pre className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto min-h-[140px] whitespace-pre-wrap">
                    {output || error || (
                      <span className="text-slate-600">Run your code to see output...</span>
                    )}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "testcases" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Automated Test Evaluation</span>
                  {testResults.length > 0 && (
                    <span
                      className={`font-semibold ${
                        testResults.every((t) => t.passed) ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {testResults.filter((t) => t.passed).length} / {testResults.length} Passed
                    </span>
                  )}
                </div>

                {testResults.length > 0 ? (
                  testResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs font-mono transition-colors ${
                        tc.passed
                          ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                          : "bg-red-950/20 border-red-500/30 text-red-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          {tc.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          Test Case #{idx + 1}
                        </div>
                        {tc.executionTimeMs && (
                          <span className="text-[10px] text-slate-400">{tc.executionTimeMs}ms</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 space-y-1">
                        <div>
                          <span className="text-slate-500">Input:</span> {tc.input}
                        </div>
                        <div>
                          <span className="text-slate-500">Expected:</span> {tc.expectedOutput}
                        </div>
                        <div>
                          <span className="text-slate-500">Actual:</span> {tc.actualOutput || "<empty>"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                    Click "Run Test Cases" above to evaluate your code against the test suite.
                  </div>
                )}
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" /> Progressive AI Hint Ladder
                  </span>
                  <span className="text-[10px] text-slate-400">3-Tier Scaffold</span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">Level 1: Conceptual Nudge</span>
                      {revealedHintLevel >= 1 ? (
                        <span className="text-[10px] text-emerald-400">Unlocked</span>
                      ) : (
                        <button
                          onClick={() => setRevealedHintLevel(1)}
                          className="text-[10px] text-amber-400 hover:underline"
                        >
                          Reveal Hint
                        </button>
                      )}
                    </div>
                    <p className="text-slate-400 mt-1">
                      {revealedHintLevel >= 1
                        ? "Consider whether you can solve this using two pointers or sliding window to avoid quadratic O(N²) iterations."
                        : "Locked • Click Reveal to view basic algorithmic direction without giving away code."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">Level 2: Data Structure Guidance</span>
                      {revealedHintLevel >= 2 ? (
                        <span className="text-[10px] text-emerald-400">Unlocked</span>
                      ) : (
                        <button
                          onClick={() => setRevealedHintLevel(2)}
                          className="text-[10px] text-amber-400 hover:underline"
                        >
                          Reveal Hint
                        </button>
                      )}
                    </div>
                    <p className="text-slate-400 mt-1">
                      {revealedHintLevel >= 2
                        ? "A HashMap / Frequency Table allows O(1) lookups of complementary pairs instead of nested scans."
                        : "Locked • Provides recommendation on optimal data structures."}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">Level 3: Optimal Big-O Complexity</span>
                      {revealedHintLevel >= 3 ? (
                        <span className="text-[10px] text-emerald-400">Unlocked</span>
                      ) : (
                        <button
                          onClick={() => setRevealedHintLevel(3)}
                          className="text-[10px] text-amber-400 hover:underline"
                        >
                          Reveal Hint
                        </button>
                      )}
                    </div>
                    <p className="text-slate-400 mt-1">
                      {revealedHintLevel >= 3
                        ? "Target: Time Complexity O(N) single pass, Space Complexity O(N) auxiliary map."
                        : "Locked • Reveals expected Big-O time and space benchmarks."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
