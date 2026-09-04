import React, { useEffect, useRef } from "react";

interface AudioWaveformProps {
  isActive: boolean;
  isSpeaking?: boolean;
  color?: string;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isActive,
  isSpeaking = false,
  color = "#10b981", // Emerald
  barCount = 28,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / barCount - 2;

      phase += isSpeaking ? 0.15 : isActive ? 0.05 : 0.01;

      for (let i = 0; i < barCount; i++) {
        // Compute harmonic wave heights
        let normalizedHeight = 0.15; // default low baseline

        if (isSpeaking) {
          // Dynamic active waveform
          const wave1 = Math.sin(phase + i * 0.4);
          const wave2 = Math.cos(phase * 1.5 + i * 0.2);
          normalizedHeight = Math.max(0.1, (wave1 + wave2 + 2) / 4);
        } else if (isActive) {
          // Gentle ambient breathing wave
          normalizedHeight = 0.2 + Math.sin(phase + i * 0.3) * 0.12;
        }

        const barHeight = Math.min(height * normalizedHeight, height - 4);
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        // Gradient styling
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "#3b82f6"); // Fade to blue

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isSpeaking, color, barCount]);

  return (
    <div className="flex items-center justify-center p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
      <canvas
        ref={canvasRef}
        width={240}
        height={48}
        className="w-full max-w-[240px] h-12"
      />
    </div>
  );
};

export default AudioWaveform;
