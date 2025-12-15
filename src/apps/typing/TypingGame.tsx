// import { useEffect, useRef, useState } from "react";
// import "./TypingGame.css";

// const INITIAL_WORDS = ["red", "green", "blue"] as const;
// type Word = (typeof INITIAL_WORDS)[number];

// function shuffle<T>(arr: T[]): T[] {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// export default function TypingGame() {
//   const [playing, setPlaying] = useState(false);
//   const [remaining, setRemaining] = useState<Word[]>([]);
//   const [loc, setLoc] = useState(0);
//   const [elapsed, setElapsed] = useState<number | null>(null);

//   const [best, setBest] = useState<number | null>(null);
//   const [miss, setMiss] = useState(0);
//   const [countdown, setCountdown] = useState<number | null>(null);

//   const startRef = useRef<number>(0);
//   const currentWord = remaining[0] ?? "";

//   const handleStart = () => {
//     if (playing || countdown !== null) return;

//     setElapsed(null);
//     setMiss(0);
//     setRemaining(shuffle([...INITIAL_WORDS]));
//     setLoc(0);
//     setCountdown(3);
//   };

//   useEffect(() => {
//     if (countdown === null) return;

//     if (countdown === 0) {
//       setCountdown(null);
//       startRef.current = Date.now();
//       setPlaying(true);
//       return;
//     }

//     const id = window.setTimeout(() => {
//       setCountdown((prev) => (prev !== null ? prev - 1 : null));
//     }, 1000);

//     return () => window.clearTimeout(id);
//   }, [countdown]);

//   useEffect(() => {
//     if (!playing) return;

//     const onKeyDown = (e: KeyboardEvent) => {
//       if (!currentWord) return;

//       if (e.key === currentWord[loc]) {
//         const nextLoc = loc + 1;

//         if (nextLoc < currentWord.length) {
//           setLoc(nextLoc);
//           return;
//         }

//         if (remaining.length <= 1) {
//           setPlaying(false);
//           setRemaining([]);
//           setLoc(0);
//           const sec = (Date.now() - startRef.current) / 1000;
//           const rounded = Number(sec.toFixed(2));
//           setElapsed(rounded);
//           setBest((prev) => (prev === null || rounded < prev ? rounded : prev));
//         } else {
//           setRemaining((prev) => prev.slice(1));
//           setLoc(0);
//         }
//       } else {
//         setMiss((prev) => prev + 1);
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [playing, loc, currentWord, remaining.length]);

//   return (
//     <main className="container">
//       <p
//         id="target"
//         role="button"
//         tabIndex={0}
//         onClick={handleStart}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") handleStart();
//         }}
//       >
//         {playing
//           ? `${"_".repeat(loc)}${currentWord.substring(loc)}`
//           : countdown !== null
//           ? `Start in: ${countdown}`
//           : "Click to start"}
//       </p>

//       <p id="result">{elapsed !== null ? `Time: ${elapsed.toFixed(2)} s` : ""}</p>
//       <p id="best">{best !== null ? `Best: ${best.toFixed(2)} s` : ""}</p>
//       <p id="miss">Miss: {miss}</p>
//     </main>
//   );
// }


import { useEffect, useRef, useState } from "react";
import "./TypingGame.css";

// const INITIAL_WORDS = ["red", "green", "blue"] as const;

const INITIAL_WORDS =["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","cyan","magenta","teal","navy","lime","maroon","olive","beige","turquoise"]as const;

type Word = (typeof INITIAL_WORDS)[number];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TypingGame() {
  const [playing, setPlaying] = useState(false);
  const [remaining, setRemaining] = useState<Word[]>([]);
  const [loc, setLoc] = useState(0);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const [best, setBest] = useState<number | null>(null);
  const [miss, setMiss] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startRef = useRef<number>(0);
  const currentWord = remaining[0] ?? "";

  const handleStart = () => {
    if (playing || countdown !== null) return;

    setElapsed(null);
    setMiss(0);
    setRemaining(shuffle([...INITIAL_WORDS]));
    setLoc(0);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      startRef.current = Date.now();
      setPlaying(true);
      return;
    }

    const id = window.setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [countdown]);

  useEffect(() => {
    if (!playing) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!currentWord) return;

      if (e.key === currentWord[loc]) {
        const nextLoc = loc + 1;

        if (nextLoc < currentWord.length) {
          setLoc(nextLoc);
          return;
        }

        if (4 <= INITIAL_WORDS.length  - remaining.length) {
          setPlaying(false);
          setRemaining([]);
          setLoc(0);
          const sec = (Date.now() - startRef.current) / 1000;
          const rounded = Number(sec.toFixed(2));
          setElapsed(rounded);
          setBest((prev) => (prev === null || rounded < prev ? rounded : prev));
        } else {
          setRemaining((prev) => prev.slice(1));
          setLoc(0);
        }
      } else {
        setMiss((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playing, loc, currentWord, remaining.length]);

  return (
    <main className="container">
      <p
        id="target"
        role="button"
        tabIndex={0}
        onClick={handleStart}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleStart();
        }}
      >
        {playing
          ? `${"_".repeat(loc)}${currentWord.substring(loc)}`
          : countdown !== null
          ? `Start in: ${countdown}`
          : "Click to start"}
      </p>

      <p id="result">{elapsed !== null ? `Time: ${elapsed.toFixed(2)} s` : ""}</p>
      <p id="best">{best !== null ? `Best: ${best.toFixed(2)} s` : ""}</p>
      <p id="miss">Miss: {miss}</p>
    </main>
  );
}
