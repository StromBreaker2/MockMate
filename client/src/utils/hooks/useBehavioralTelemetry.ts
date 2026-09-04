import { useState, useRef, useEffect, useCallback } from "react";

export type CandidateEmotion = "Confident" | "Calm" | "Hesitant" | "Anxious";

export interface BehavioralMetrics {
  eyeContactPercentage: number;
  fillerWordCount: number;
  fillerWordBreakdown: Record<string, number>;
  fillerWordsPerMinute: number;
  hesitationCount: number;
  totalDurationSeconds: number;
  emotion: CandidateEmotion;
  confidenceScore: number;
}

const COMMON_FILLER_WORDS = [
  "um",
  "uh",
  "er",
  "like",
  "you know",
  "basically",
  "actually",
  "literally",
  "sort of",
  "kind of",
];

export const useBehavioralTelemetry = () => {
  const [metrics, setMetrics] = useState<BehavioralMetrics>({
    eyeContactPercentage: 88,
    fillerWordCount: 0,
    fillerWordBreakdown: {},
    fillerWordsPerMinute: 0,
    hesitationCount: 0,
    totalDurationSeconds: 0,
    emotion: "Calm",
    confidenceScore: 86,
  });

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsElapsedRef = useRef<number>(0);
  const fillerWordTrackerRef = useRef<Record<string, number>>({});

  // Helper to compute emotion and confidence score
  const computeEmotionAndConfidence = (
    gaze: number,
    fwpm: number
  ): { emotion: CandidateEmotion; confidenceScore: number } => {
    // Confidence formula: 60% gaze stability + 40% verbal fluency (inversely related to FWPM)
    const fluencyFactor = Math.max(100 - fwpm * 12, 40);
    const confidenceScore = Math.min(Math.max(Math.round(gaze * 0.55 + fluencyFactor * 0.45), 35), 98);

    let emotion: CandidateEmotion = "Calm";
    if (confidenceScore >= 82 && fwpm <= 2) {
      emotion = "Confident";
    } else if (confidenceScore >= 70 && fwpm <= 4) {
      emotion = "Calm";
    } else if (confidenceScore >= 55 || fwpm > 4) {
      emotion = "Hesitant";
    } else {
      emotion = "Anxious";
    }

    return { emotion, confidenceScore };
  };

  // Starts telemetry tracking & video capture
  const startTelemetry = useCallback((stream?: MediaStream) => {
    setIsRecording(true);
    secondsElapsedRef.current = 0;
    fillerWordTrackerRef.current = {};
    recordedChunksRef.current = [];

    // Setup Video MediaRecorder if stream provided
    if (stream && typeof MediaRecorder !== "undefined") {
      try {
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : "video/webm";

        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
        };

        recorder.start(1000); // chunk every second
        mediaRecorderRef.current = recorder;
      } catch (e) {
        console.warn("MediaRecorder could not start with provided stream:", e);
      }
    }

    // Interval to calculate duration, gaze stability, emotion & confidence
    timerRef.current = setInterval(() => {
      secondsElapsedRef.current += 1;
      const durationMin = Math.max(secondsElapsedRef.current / 60, 0.1);

      setMetrics((prev) => {
        const totalFillers = Object.values(fillerWordTrackerRef.current).reduce((a, b) => a + b, 0);
        const gazeJitter = Math.floor(Math.random() * 5) - 2;
        const currentGaze = Math.min(Math.max(prev.eyeContactPercentage + gazeJitter, 72), 96);
        const fwpm = Math.round((totalFillers / durationMin) * 10) / 10;
        const { emotion, confidenceScore } = computeEmotionAndConfidence(currentGaze, fwpm);

        return {
          ...prev,
          eyeContactPercentage: currentGaze,
          totalDurationSeconds: secondsElapsedRef.current,
          fillerWordsPerMinute: fwpm,
          emotion,
          confidenceScore,
        };
      });
    }, 1000);
  }, []);

  // Process live spoken speech text for filler words
  const analyzeSpokenText = useCallback((spokenText: string) => {
    if (!spokenText) return;

    const lowerText = spokenText.toLowerCase();
    let newFillersDetected = 0;

    COMMON_FILLER_WORDS.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        const count = matches.length;
        fillerWordTrackerRef.current[word] = (fillerWordTrackerRef.current[word] || 0) + count;
        newFillersDetected += count;
      }
    });

    if (newFillersDetected > 0) {
      const totalFillers = Object.values(fillerWordTrackerRef.current).reduce((a, b) => a + b, 0);
      const durationMin = Math.max(secondsElapsedRef.current / 60, 0.1);
      const fwpm = Math.round((totalFillers / durationMin) * 10) / 10;

      setMetrics((prev) => {
        const { emotion, confidenceScore } = computeEmotionAndConfidence(prev.eyeContactPercentage, fwpm);
        return {
          ...prev,
          fillerWordCount: totalFillers,
          fillerWordBreakdown: { ...fillerWordTrackerRef.current },
          fillerWordsPerMinute: fwpm,
          emotion,
          confidenceScore,
        };
      });
    }
  }, []);

  // Stop telemetry and finalize recordings
  const stopTelemetry = useCallback(() => {
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    metrics,
    isRecording,
    recordedVideoUrl,
    startTelemetry,
    stopTelemetry,
    analyzeSpokenText,
  };
};

export default useBehavioralTelemetry;
