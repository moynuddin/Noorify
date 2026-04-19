"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookMarked, Star } from "lucide-react";
import { PRAYER_STEPS, PRAYER_RAKAHS, COMMON_SURAHS } from "@/constants/learn";

// ─── Component ────────────────────────────────────────────────────────────────

type Tab = "prayer" | "surahs";

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<Tab>("prayer");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedSurah, setExpandedSurah] = useState<number | null>(null);
  const [showArabic, setShowArabic] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);

  return (
    <div className="min-h-screen px-4 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center">
            <BookMarked size={18} className="text-brand-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              New Muslim Guide
            </h1>
            <p className="text-xs text-foreground/50">
              For reverts &amp; beginners
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6 bg-card-bg border border-card-border rounded-2xl p-1">
        <button
          onClick={() => setActiveTab("prayer")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "prayer"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-foreground/60 hover:text-foreground/80"
          }`}
        >
          🕌 How to Pray
        </button>
        <button
          onClick={() => setActiveTab("surahs")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === "surahs"
              ? "bg-brand-500 text-white shadow-sm"
              : "text-foreground/60 hover:text-foreground/80"
          }`}
        >
          📖 Common Surahs
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "prayer" && (
          <motion.div
            key="prayer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Prayer rakahs summary */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">
                Daily Prayers &amp; Rakahs
              </p>
              <div className="grid grid-cols-5 gap-2">
                {PRAYER_RAKAHS.map((p) => (
                  <div
                    key={p.name}
                    className="bg-card-bg border border-card-border rounded-2xl p-2.5 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-bold text-foreground/40 uppercase">
                      {p.time}
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {p.name}
                    </span>
                    <span className="text-xs text-foreground/50 font-medium">
                      {p.arabic}
                    </span>
                    <span
                      className={`text-xs font-bold mt-0.5 bg-linear-to-r ${p.color} bg-clip-text text-transparent`}
                    >
                      {p.rakahs} rak&apos;ah
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3">
              Step-by-Step Prayer Guide
            </p>
            <div className="space-y-2">
              {PRAYER_STEPS.map((s) => {
                const isOpen = expandedStep === s.step;
                return (
                  <motion.div
                    key={s.step}
                    layout
                    className="bg-card-bg border border-card-border rounded-2xl overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setExpandedStep(isOpen ? null : s.step)}
                    >
                      <span className="text-xl leading-none">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-brand-500/80 bg-brand-500/10 px-1.5 py-0.5 rounded-md">
                            {s.step}
                          </span>
                          <span className="font-semibold text-sm text-foreground truncate">
                            {s.title}
                          </span>
                        </div>
                        {s.arabic && !isOpen && (
                          <p className="text-xs text-foreground/50 mt-0.5 font-arabic leading-relaxed">
                            {s.arabic.split(" ").slice(0, 4).join(" ")}…
                          </p>
                        )}
                      </div>
                      {isOpen ? (
                        <ChevronUp
                          size={16}
                          className="text-foreground/40 shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-foreground/40 shrink-0"
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3 border-t border-card-border pt-3">
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              {s.description}
                            </p>
                            {s.arabic && (
                              <div className="bg-brand-500/5 rounded-xl p-3 space-y-2">
                                <p
                                  dir="rtl"
                                  className="text-right text-lg leading-loose text-foreground font-arabic selectable-text"
                                >
                                  {s.arabic}
                                </p>
                                {s.transliteration && (
                                  <p className="text-xs text-brand-600 dark:text-brand-400 italic selectable-text">
                                    {s.transliteration}
                                  </p>
                                )}
                                {s.meaning && (
                                  <p className="text-xs text-foreground/60 selectable-text">
                                    {s.meaning}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "surahs" && (
          <motion.div
            key="surahs"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Display toggles */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {[
                { label: "Arabic", value: showArabic, setter: setShowArabic },
                {
                  label: "Transliteration",
                  value: showTransliteration,
                  setter: setShowTransliteration,
                },
                {
                  label: "Meaning",
                  value: showMeaning,
                  setter: setShowMeaning,
                },
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => t.setter(!t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    t.value
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-card-bg text-foreground/50 border-card-border"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {COMMON_SURAHS.map((surah) => {
                const isOpen = expandedSurah === surah.id;
                return (
                  <motion.div
                    key={surah.id}
                    layout
                    className="bg-card-bg border border-card-border rounded-2xl overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center gap-3 p-4 text-left"
                      onClick={() => setExpandedSurah(isOpen ? null : surah.id)}
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand-500">
                          {surah.number}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {surah.name}
                          </span>
                          <span className="text-sm text-foreground/50 font-arabic">
                            {surah.arabic}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/50 mt-0.5">
                          {surah.meaning}
                        </p>
                      </div>
                      {isOpen ? (
                        <ChevronUp
                          size={16}
                          className="text-foreground/40 shrink-0"
                        />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-foreground/40 shrink-0"
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-card-border">
                            {/* Note */}
                            <div className="flex items-start gap-2 px-4 py-3 bg-brand-500/5">
                              <Star
                                size={13}
                                className="text-brand-500 mt-0.5 shrink-0"
                              />
                              <p className="text-xs text-brand-700 dark:text-brand-300 leading-relaxed">
                                {surah.note}
                              </p>
                            </div>

                            {/* Ayahs */}
                            <div className="px-4 pb-4 pt-3 space-y-4">
                              {surah.ayahs.map((ayah, idx) => (
                                <div key={idx} className="space-y-1.5">
                                  {showArabic && (
                                    <p
                                      dir="rtl"
                                      className="text-right text-xl leading-loose text-foreground font-arabic selectable-text"
                                    >
                                      {ayah.arabic}
                                    </p>
                                  )}
                                  {showTransliteration && (
                                    <p className="text-xs text-brand-600 dark:text-brand-400 italic selectable-text leading-relaxed">
                                      {ayah.transliteration}
                                    </p>
                                  )}
                                  {showMeaning && (
                                    <p className="text-xs text-foreground/60 selectable-text leading-relaxed">
                                      {ayah.meaning}
                                    </p>
                                  )}
                                  {idx < surah.ayahs.length - 1 && (
                                    <div className="border-b border-card-border/60 pt-1" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
