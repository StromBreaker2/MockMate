import { useState } from "react";

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python3: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
};

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

const getVersionForLanguage = (language: keyof typeof LANGUAGE_VERSIONS): string => {
  return LANGUAGE_VERSIONS[language] || "18.15.0";
};

export interface TestCase {
  id?: string;
  input: string;
  expectedOutput: string;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs?: number;
  error?: string;
}

export const usePiston = () => {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);

  const runCode = async (
    code: string,
    language: keyof typeof LANGUAGE_VERSIONS,
    input: string = ""
  ): Promise<string> => {
    setIsLoading(true);
    setOutput("");
    setError("");

    try {
      const version = getVersionForLanguage(language);

      const body = {
        language,
        version,
        files: [
          {
            name: `main.${language === "python3" ? "py" : language === "cpp" ? "cpp" : language}`,
            content: code,
          },
        ],
        stdin: input,
        args: [],
      };

      const response = await fetch(PISTON_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      const runOutput = result.run?.output || "";
      setOutput(runOutput);
      return runOutput;
    } catch (err: any) {
      console.error("Code execution error:", err);
      const errMsg = err.message || "An error occurred while running the code.";
      setError(errMsg);
      return errMsg;
    } finally {
      setIsLoading(false);
    }
  };

  const runTestCases = async (
    code: string,
    language: keyof typeof LANGUAGE_VERSIONS,
    testCases: TestCase[]
  ): Promise<{ allPassed: boolean; results: TestCaseResult[] }> => {
    setIsLoading(true);
    const results: TestCaseResult[] = [];

    try {
      for (const tc of testCases) {
        const startTime = performance.now();
        const actualOutput = await runCode(code, language, tc.input);
        const duration = Math.round(performance.now() - startTime);

        const cleanExpected = tc.expectedOutput.trim();
        const cleanActual = actualOutput.trim();
        const passed = cleanExpected === cleanActual;

        results.push({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput,
          passed,
          executionTimeMs: duration,
        });
      }

      setTestResults(results);
      const allPassed = results.every((r) => r.passed);
      return { allPassed, results };
    } finally {
      setIsLoading(false);
    }
  };

  return { runCode, runTestCases, output, error, isLoading, testResults };
};

export default usePiston;
