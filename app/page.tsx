"use client";

import { useDhikrStore, PREDEFINED_DHIKRS } from "@/store/useDhikrStore";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronDown, Wind, Sparkles, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export default function Home() {
  const {
    currentDhikr,
    currentCount,
    increment,
    resetCounter,
    setDhikr,
    dailyChallenge,
  } = useDhikrStore();
  const [showSelector, setShowSelector] = useState(false);
  const [breathingMode, setBreathingMode] = useState(false);
  const [tapKey, setTapKey] = useState(0);
  const [floaters, setFloaters] = useState<number[]>([]);

  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    if (dailyChallenge.completed && !hasCelebrated) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#34a88f", "#5ac5a8", "#f2fcf5"],
      });
      setHasCelebrated(true);
    }
  }, [dailyChallenge.completed, hasCelebrated]);

  useEffect(() => {
    const interval = setInterval(() => {
      useDhikrStore.getState().incrementGlobalSimulation();
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.min((currentCount / currentDhikr.target) * 100, 100);
  const challengeDhikr = PREDEFINED_DHIKRS.find(
    (d) => d.id === dailyChallenge.dhikrId,
  );

  const handleTap = () => {
    increment();
    setTapKey((k) => k + 1);
    const id = Date.now();
    setFloaters((f) => [...f, id]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x !== id)), 700);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-8 md:px-12 py-6 overflow-hidden">
      {/* Background Visual Flair */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-400/20 dark:bg-brand-600/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-80 h-80 bg-brand-200/20 dark:bg-brand-900/40 blur-[80px] rounded-full pointer-events-none" />

      {/* Daily Challenge Banner */}
      {!dailyChallenge.completed && challengeDhikr && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mb-6 bg-gradient-to-r from-brand-500/10 to-transparent border border-brand-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm backdrop-blur-md relative z-20"
        >
          <div className="w-10 h-10 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
              Daily Goal
            </h3>
            <p className="text-sm font-medium text-foreground">
              Complete 100x {challengeDhikr.name}
            </p>
          </div>
          <div className="ml-auto text-xs font-bold text-brand-500">
            {dailyChallenge.progress}/100
          </div>
        </motion.div>
      )}

      {dailyChallenge.completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm mb-6 bg-brand-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md relative z-20"
        >
          <Sparkles size={20} className="text-brand-100" />
          <p className="text-sm font-semibold">Daily Goal Completed! ✨</p>
        </motion.div>
      )}

      <div className="w-full flex justify-between items-center mb-8 relative z-20">
        <div className="relative">
          <button
            onClick={() => setShowSelector(!showSelector)}
            className="flex items-center gap-2 bg-card-bg/60 px-4 py-2.5 rounded-full border border-card-border shadow-sm backdrop-blur-xl transition hover:bg-card-bg/80"
          >
            <span className="font-semibold text-sm tracking-wide">
              {currentDhikr.name}
            </span>
            <motion.div animate={{ rotate: showSelector ? 180 : 0 }}>
              <ChevronDown size={16} className="text-foreground/50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showSelector && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-3 left-0 w-64 bg-card-bg/90 backdrop-blur-2xl border border-card-border rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                {PREDEFINED_DHIKRS.map((d) => (
                  <button
                    key={d.id}
                    className="w-full text-left px-5 py-3.5 hover:bg-brand-500/10 transition-colors flex justify-between items-center border-b border-card-border/50 last:border-0"
                    onClick={() => {
                      setDhikr(d);
                      setShowSelector(false);
                    }}
                  >
                    <div>
                      <span className="font-medium text-sm block">
                        {d.name}
                      </span>
                      {d.id === dailyChallenge.dhikrId && (
                        <span className="text-[9px] uppercase tracking-wider text-brand-500 font-bold block mt-0.5">
                          Daily Goal
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-brand-500 bg-brand-500/10 px-2 py-1 rounded-md">
                      {d.target}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBreathingMode(!breathingMode)}
            className={`p-3 rounded-full border transition-all outline-none shadow-sm backdrop-blur-xl ${
              breathingMode
                ? "bg-brand-500 border-brand-500 text-white"
                : "bg-card-bg/60 border-card-border text-foreground/50 hover:text-foreground"
            }`}
            title="Breathing Mode"
          >
            <Wind size={18} />
          </button>

          <button
            onClick={resetCounter}
            className="p-3 rounded-full bg-card-bg/60 backdrop-blur-xl border border-card-border text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-all outline-none shadow-sm"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="text-center mb-6 relative z-10 flex flex-col items-center">
        <motion.h2
          key={currentDhikr.arabic}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-arabic text-brand-600 dark:text-brand-400 mb-4 drop-shadow-sm font-semibold leading-tight"
          dir="rtl"
        >
          {currentDhikr.arabic}
        </motion.h2>
        <motion.p
          key={currentDhikr.meaning}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-foreground/60 text-sm sm:text-base md:text-lg tracking-wide font-medium max-w-sm mb-4"
        >
          {currentDhikr.meaning}
        </motion.p>

        {/* Virtue Bubble */}
        {currentDhikr.virtue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-2 max-w-xs bg-brand-500/5 border border-brand-500/10 px-4 py-3 rounded-2xl"
          >
            <BookOpen size={16} className="text-brand-500 mt-1 shrink-0" />
            <p className="text-xs text-foreground/80 font-medium leading-relaxed italic text-left">
              "{currentDhikr.virtue}"{" "}
              <span className="text-brand-500 font-bold opacity-75">
                — {currentDhikr.virtueReference}
              </span>
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] relative z-10 mb-8 mt-2 transition-all duration-300">
        <motion.button
          whileTap={{ scale: breathingMode ? 1 : 0.94 }}
          onClick={handleTap}
          className="relative w-full aspect-square rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-center bg-gradient-to-br from-card-bg to-card-bg/50 border border-card-border/50 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] outline-none group overflow-hidden"
          style={{ WebkitTapHighlightColor: "transparent" }}
          animate={
            breathingMode
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0px 8px 40px -12px rgba(52,168,143,0.1)",
                    "0px 20px 60px -10px rgba(52,168,143,0.3)",
                    "0px 8px 40px -12px rgba(52,168,143,0.1)",
                  ],
                }
              : {}
          }
          transition={
            breathingMode
              ? {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {}
          }
        >
          {/* Ripple on tap */}
          <AnimatePresence>
            {tapKey > 0 && (
              <motion.div
                key={tapKey}
                className="absolute inset-0 rounded-[3rem] md:rounded-[4rem] bg-brand-500/20 pointer-events-none"
                initial={{ opacity: 0.7, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* Floating +1 labels */}
          <AnimatePresence>
            {floaters.map((id) => (
              <motion.span
                key={id}
                className="absolute text-brand-500 font-bold text-2xl pointer-events-none select-none z-20"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -60 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                +1
              </motion.span>
            ))}
          </AnimatePresence>

          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none drop-shadow-md">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              className="stroke-card-border dark:stroke-card-border/50 fill-none"
              strokeWidth="6"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="46%"
              className="stroke-brand-500 fill-none"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength="100"
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${progress} 100` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>

          <span className="text-6xl sm:text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 z-10 tabular-nums tracking-tighter drop-shadow-sm">
            {currentCount}
          </span>
          <span className="text-xs sm:text-sm md:text-base font-semibold text-brand-500/80 z-10 mt-3 md:mt-4 tracking-widest uppercase">
            Target {currentDhikr.target}
          </span>

          {breathingMode && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 text-[10px] uppercase tracking-widest text-brand-500 font-bold"
            >
              Breathe
            </motion.span>
          )}
        </motion.button>
      </div>

      <div className="mt-auto text-center relative z-10">
        <p className="text-[10px] sm:text-xs md:text-sm text-foreground/40 font-medium tracking-wide uppercase">
          Tap anywhere to count
        </p>
      </div>
    </div>
  );
}
