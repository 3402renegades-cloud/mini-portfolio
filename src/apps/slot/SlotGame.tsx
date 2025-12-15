import { useCallback, useMemo, useRef, useState } from "react";
import "./SlotGame.css";

import seven from "./img/seven.png";
import bell from "./img/bell.png";
import cherry from "./img/cherry.png";

type SymbolKey = "seven" | "bell" | "cherry";

const SYMBOLS: Record<SymbolKey, string> = { seven, bell, cherry };
const ORDER: SymbolKey[] = ["seven", "bell", "cherry"];

type PanelState = {
  symbol: SymbolKey;
  spinning: boolean;
  unmatched: boolean;
};

const randomSymbol = (): SymbolKey =>
  ORDER[Math.floor(Math.random() * ORDER.length)];

export default function SlotGame() {
  const [panels, setPanels] = useState<PanelState[]>([
    { symbol: "seven", spinning: false, unmatched: false },
    { symbol: "seven", spinning: false, unmatched: false },
    { symbol: "seven", spinning: false, unmatched: false },
  ]);

  const spinningAny = useMemo(() => panels.some((p) => p.spinning), [panels]);
  const timersRef = useRef<Array<number | null>>([null, null, null]);

  const checkResult = useCallback((finals: SymbolKey[]) => {
    const isUnmatched = (i: number, a: number, b: number) =>
      finals[i] !== finals[a] && finals[i] !== finals[b];

    setPanels((prev) =>
      prev.map((p, i) =>
        isUnmatched(i, (i + 1) % 3, (i + 2) % 3) ? { ...p, unmatched: true } : p
      )
    );
  }, []);

  const stopOne = useCallback(
    (index: number) => {
      setPanels((prev) => {
        if (!prev[index].spinning) return prev;

        const next = prev.map((p, i) =>
          i === index ? { ...p, spinning: false } : p
        );

        const id = timersRef.current[index];
        if (id !== null) {
          clearInterval(id);
          timersRef.current[index] = null;
        }

        if (next.every((p) => !p.spinning)) {
          checkResult(next.map((p) => p.symbol));
        }
        return next;
      });
    },
    [checkResult]
  );

  const spinAll = useCallback(() => {
    setPanels((prev) => prev.map((p) => ({ ...p, unmatched: false, spinning: true })));

    ORDER.forEach((_, i) => {
      const old = timersRef.current[i];
      if (old !== null) clearInterval(old);

      timersRef.current[i] = window.setInterval(() => {
        setPanels((prev) =>
          prev.map((p, index) =>
            index === i ? { ...p, symbol: randomSymbol() } : p
          )
        );
      }, 100);
    });
  }, []);

  const stopAll = useCallback(() => {
    [0, 1, 2].forEach(stopOne);
  }, [stopOne]);

  return (
    <div className="container">
      <h1>React + TypeScript Slot</h1>

      <div className="controls">
        <button onClick={spinAll} disabled={spinningAny} id="spin">
          SPIN
        </button>
        <button className="secondary" onClick={stopAll} disabled={!spinningAny}>
          STOP ALL
        </button>
      </div>

      <div className="board">
        {panels.map((p, i) => (
          <PanelView key={i} index={i} state={p} onStop={() => stopOne(i)} />
        ))}
      </div>
    </div>
  );
}

function PanelView({
  index,
  state,
  onStop,
}: {
  index: number;
  state: PanelState;
  onStop: () => void;
}) {
  const src = SYMBOLS[state.symbol];

  return (
    <section className="panel" aria-label={`panel-${index + 1}`}>
      <img
        src={src}
        alt={state.symbol}
        className={state.unmatched ? "unmatched" : ""}
        draggable={false}
      />
      <button className={`stop ${!state.spinning ? "inactive" : ""}`} onClick={onStop} disabled={!state.spinning}>
        STOP
      </button>
    </section>
  );
}
