import { useState, useEffect, useCallback } from "react";

export type ProctoringViolationType =
  | "TAB_SWITCH"
  | "WINDOW_BLUR"
  | "FULLSCREEN_EXIT"
  | "SUSPICIOUS_PASTE";

export interface ProctoringViolation {
  id: string;
  type: ProctoringViolationType;
  timestamp: string;
  message: string;
}

export interface UseProctoringOptions {
  enabled?: boolean;
  onViolation?: (violation: ProctoringViolation) => void;
  maxViolationsBeforeFlag?: number;
}

export const useProctoring = (options: UseProctoringOptions = {}) => {
  const { enabled = true, onViolation, maxViolationsBeforeFlag = 3 } = options;

  const [violations, setViolations] = useState<ProctoringViolation[]>([]);
  const [integrityScore, setIntegrityScore] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeWarning, setActiveWarning] = useState<string | null>(null);

  const recordViolation = useCallback(
    (type: ProctoringViolationType, message: string) => {
      if (!enabled) return;

      const newViolation: ProctoringViolation = {
        id: Date.now().toString(),
        type,
        timestamp: new Date().toLocaleTimeString(),
        message,
      };

      setViolations((prev) => [...prev, newViolation]);

      // Deduct from integrity score
      setIntegrityScore((prev) => {
        let penalty = 10;
        if (type === "TAB_SWITCH") penalty = 15;
        if (type === "SUSPICIOUS_PASTE") penalty = 8;
        if (type === "WINDOW_BLUR") penalty = 10;
        return Math.max(prev - penalty, 0);
      });

      setActiveWarning(message);
      if (onViolation) {
        onViolation(newViolation);
      }

      // Auto clear warning modal after 5 seconds
      setTimeout(() => {
        setActiveWarning((current) => (current === message ? null : current));
      }, 5000);
    },
    [enabled, onViolation]
  );

  // Request fullscreen
  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      console.warn("Fullscreen request denied:", e);
    }
  }, []);

  // Listeners for Tab switch & Blur
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("TAB_SWITCH", "Warning: Tab switch detected! Please remain on the interview window.");
      }
    };

    const handleWindowBlur = () => {
      recordViolation("WINDOW_BLUR", "Warning: Window focus lost. Focus on the interview screen.");
    };

    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen) {
        recordViolation("FULLSCREEN_EXIT", "Interview security alert: Exited full-screen mode.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [enabled, recordViolation]);

  return {
    violations,
    integrityScore,
    isFlagged: violations.length >= maxViolationsBeforeFlag,
    isFullscreen,
    activeWarning,
    clearWarning: () => setActiveWarning(null),
    enterFullscreen,
    recordViolation,
  };
};

export default useProctoring;
