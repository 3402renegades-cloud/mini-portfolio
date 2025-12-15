import { useEffect, useRef, useState } from "react";
import "./Omikuji.css";

const CANDIDATES = ["大吉", "中吉", "吉", "小吉", "凶"] as const;
type Fortune = (typeof CANDIDATES)[number];

export default function Omikuji() {
  const [result, setResult] = useState<Fortune | "?">("?");
  const [isDrawing, setIsDrawing] = useState(false);

  const [pop, setPop] = useState(false);
  const popTimeoutRef = useRef<number | null>(null);

  const shuffleIntervalRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const [history, setHistory] = useState<Fortune[]>([]);

  const pickRandom = (): Fortune => {
    const idx = Math.floor(Math.random() * CANDIDATES.length);
    return CANDIDATES[idx];
  };

  const triggerPop = () => {
    setPop(true);
    if (popTimeoutRef.current != null) window.clearTimeout(popTimeoutRef.current);
    popTimeoutRef.current = window.setTimeout(() => setPop(false), 180);
  };

  const draw = () => {
    if (isDrawing) return;
    setIsDrawing(true);

    if (shuffleIntervalRef.current != null) {
      window.clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }
    if (settleTimeoutRef.current != null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }

    shuffleIntervalRef.current = window.setInterval(() => {
      setResult(pickRandom());
    }, 80);

    settleTimeoutRef.current = window.setTimeout(() => {
      if (shuffleIntervalRef.current != null) {
        window.clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }

      const final = pickRandom();
      setResult(final);
      setHistory((prev) => [final, ...prev].slice(0, 5));

      triggerPop();
      setIsDrawing(false);
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current != null) window.clearInterval(shuffleIntervalRef.current);
      if (settleTimeoutRef.current != null) window.clearTimeout(settleTimeoutRef.current);
      if (popTimeoutRef.current != null) window.clearTimeout(popTimeoutRef.current);
    };
  }, []);

  return (
    <div className="page">
      <main className="app">
        <section className="card">
          <h1 className="cardTitle">今日の運勢</h1>
          <p className={`resultText ${pop ? "is-pop" : ""} ${isDrawing ? "is-drawing" : ""}`} aria-live="polite">
            {result}
          </p>
        </section>

        <button type="button" onClick={draw} disabled={isDrawing} className="drawButton">
          {isDrawing ? "引いています..." : "おみくじを引く"}
        </button>

        <section className="history">
          <h2 className="historyTitle">履歴（最新5回）</h2>
          {history.length === 0 ? (
            <p className="historyEmpty">まだ履歴がありません</p>
          ) : (
            <ul className="historyList">
              {history.map((f, i) => (
                <li key={`${f}-${i}`} className="historyItem">
                  <span className="historyIndex">#{history.length - i}</span>
                  <span className="historyValue">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
