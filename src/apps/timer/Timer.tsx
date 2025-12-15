import { useEffect, useRef, useState } from "react";
import "./TimerApp.css";

const PRESETS = [
  { label: "3秒", ms: 3_000 },
  { label: "10秒", ms: 10_000 },
  { label: "30秒", ms: 30_000 },
] as const;

const fmt = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function Timer() {
  const [duration, setDuration] = useState<number>(PRESETS[0].ms);
  const [remaining, setRemaining] = useState<number>(PRESETS[0].ms);
  const [running, setRunning] = useState(false);

  const deadlineRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (deadlineRef.current == null) return;
      const remain = Math.max(0, deadlineRef.current - performance.now());
      setRemaining(remain);

      if (remain > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
        deadlineRef.current = null;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [running]);

  const handleStart = () => {
    if (running) return;
    deadlineRef.current = performance.now() + remaining;
    setRunning(true);
  };

  const handlePause = () => {
    if (!running) return;
    setRunning(false);

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (deadlineRef.current != null) {
      const remain = Math.max(0, deadlineRef.current - performance.now());
      setRemaining(remain);
      deadlineRef.current = null;
    }
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(duration);
    deadlineRef.current = null;

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const handleChangePreset = (ms: number) => {
    setRunning(false);
    setDuration(ms);
    setRemaining(ms);
    deadlineRef.current = null;

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  return (
    <main style={{ width: 320, margin: "16px auto", textAlign: "center" }}>
      <div style={{ marginBottom: 16, display: "flex", gap: 8, justifyContent: "center" }}>
        {PRESETS.map((p) => (
          <button
            key={p.ms}
            type="button"
            onClick={() => handleChangePreset(p.ms)}
            disabled={running}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p style={{ margin: 0, background: "#ddd", padding: "32px 0", fontSize: 40, fontFamily: "Courier New", color: "#000" }}>
        {fmt(remaining)}
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button type="button" onClick={handleStart} disabled={running} style={{ flex: 1 }}>
          Start
        </button>
        <button type="button" onClick={handlePause} disabled={!running} style={{ flex: 1 }}>
          Pause
        </button>
        <button type="button" onClick={handleReset} style={{ flex: 1 }}>
          Reset
        </button>
      </div>
    </main>
  );
}
