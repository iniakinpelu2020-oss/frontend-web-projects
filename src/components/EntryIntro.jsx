// src/components/EntryIntro.jsx
import { useEffect, useRef, useState } from "react";

const TOTAL_MS = 5000;
const SCENE_ONE_END = 1600;
const SCENE_TWO_END = 3200;
const LOCKUP_END = 4300;
const CURTAIN_MS = 700;
const CURTAIN_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const HEX_ROWS = [
  "7F 3A 9C E1 04 B8 2D F6 11 C0 5E 8A",
  "A2 FF 13 6B D9 40 CE 77 0B 9A 31 E4",
  "5C 0E F8 27 B3 6D 91 4A EE 08 C5 2B",
  "D4 83 1F AA 60 E7 39 C2 58 1D F0 6E",
  "3B C9 71 E2 0D 9F 46 B5 2A 87 DC 13",
  "EF 52 A6 0C 8E D1 75 3F B0 4C 19 AE",
  "18 6D C4 F3 2B 90 E8 57 A1 3C D6 0F",
  "B7 26 9E 4F D0 1A C8 63 EB 7D 25 94",
];

export default function EntryIntro({ onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [sceneStage, setSceneStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timers = useRef([]);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  const completedRef = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearTimers();
    setPhase("done");
    onComplete?.();
  };

  const startCurtain = () => {
    if (completedRef.current) return;
    if (timers.current._curtainStarted) return;
    timers.current._curtainStarted = true;
    clearTimers();
    try {
      window.scrollTo(0, 0);
    } catch {}
    if (reducedMotion) {
      finish();
      return;
    }
    setPhase("curtain");
    timers.current.push(setTimeout(finish, CURTAIN_MS));
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (reducedMotion) {
      setSceneStage(2);
      setProgress(100);
      timers.current.push(setTimeout(startCurtain, 0));
      return clearTimers;
    }

    setSceneStage(0);
    setProgress(0);
    timers.current.push(setTimeout(() => setSceneStage(1), SCENE_ONE_END));
    timers.current.push(setTimeout(() => setSceneStage(2), SCENE_TWO_END));
    timers.current.push(setTimeout(startCurtain, LOCKUP_END));

    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const lockupElapsed = Math.max(0, elapsed - SCENE_TWO_END);
      const span = LOCKUP_END - SCENE_TWO_END;
      setProgress(Math.min(100, Math.round((lockupElapsed / span) * 100)));
      if (elapsed < LOCKUP_END && !completedRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return clearTimers;
  }, [reducedMotion]);

  useEffect(() => clearTimers, []);

  if (phase === "done") return null;

  const curtainStyle =
    phase === "curtain"
      ? {
          transform: "translateY(100%)",
          transition: `transform ${CURTAIN_MS}ms ${CURTAIN_EASE}`,
        }
      : { transform: "translateY(0%)" };

  return (
    <div
      role="dialog"
      aria-label="Introduction"
      className="fixed inset-0 z-[90] bg-[#160D11] text-white overflow-hidden"
      style={curtainStyle}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          sceneStage === 0 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={sceneStage !== 0}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="laserFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0" />
              <stop offset="60%" stopColor="#E11D48" stopOpacity="1" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g
            stroke="#E11D48"
            strokeOpacity="0.25"
            strokeWidth="0.6"
            fill="none"
          >
            {[-600, -400, -200, 0, 200, 400, 600, 800, 1000].map((x) => (
              <line key={x} x1="200" y1="380" x2={x} y2="800" />
            ))}
            {[400, 440, 490, 550, 620, 710].map((y, i) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y + i * 0} />
            ))}
          </g>
          {[60, 140, 200, 260, 340].map((x, i) => (
            <rect
              key={x}
              x={x}
              y="-200"
              width="1.5"
              height="200"
              fill="url(#laserFade)"
              className="intro-laser"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </svg>
        <Label text="01 // WEB & AI ARCHITECTURE" />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          sceneStage === 1 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={sceneStage !== 1}
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 font-mono text-[11px] tracking-widest text-white/40">
          {HEX_ROWS.map((row, i) => (
            <div key={i} className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-[#E11D48]/70">{String(i).padStart(2, "0")}</span>
              <span className="truncate">{row}</span>
            </div>
          ))}
        </div>
        <div
          className="intro-scanline absolute left-0 right-0 h-[2px] bg-[#E11D48] shadow-[0_0_18px_4px_rgba(225,29,72,0.55)]"
          style={{ top: 0 }}
        />
        <Label text="02 // ETHICAL HACKING & APPSEC" />
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
          sceneStage === 2 ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={sceneStage !== 2}
      >
        <h1 className="text-4xl sm:text-6xl font-black tracking-[0.2em]">
          DRIPPY DEE
        </h1>
        <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-[#E11D48] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-6 text-[#E11D48] text-2xl animate-bounce" aria-hidden="true">
          ↓
        </div>
      </div>

      {phase === "intro" && (
        <button
          type="button"
          onClick={startCurtain}
          className="absolute bottom-8 right-6 z-10 rounded-sm border border-[#E11D48] px-4 py-2 font-mono text-xs tracking-widest text-white hover:bg-[#E11D48] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] transition-colors"
        >
          Skip ↓
        </button>
      )}

      <style>{`
        @keyframes introLaserDrop {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(1000px); opacity: 0; }
        }
        @keyframes introScan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .intro-laser {
          animation: introLaserDrop 1.6s linear infinite;
        }
        .intro-scanline {
          animation: introScan 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .intro-laser, .intro-scanline { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Label({ text }) {
  return (
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center px-6">
      <p className="font-mono text-sm sm:text-base tracking-[0.25em] text-white text-center">
        {text}
      </p>
    </div>
  );
}
