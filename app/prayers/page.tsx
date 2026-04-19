"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  MoonStar,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  usePrayerTimes,
  CALCULATION_METHODS,
  type PrayerName,
  type CalcMethodKey,
} from "@/hooks/usePrayerTimes";

// ─── Prayer metadata ──────────────────────────────────────────────────────────

const PRAYER_META: Record<
  PrayerName,
  {
    label: string;
    arabic: string;
    gradient: string;
    icon: React.ElementType;
    textColor: string;
  }
> = {
  fajr: {
    label: "Fajr",
    arabic: "الفجر",
    gradient: "from-indigo-600/20 to-blue-500/10",
    icon: MoonStar,
    textColor: "text-indigo-400",
  },
  sunrise: {
    label: "Sunrise",
    arabic: "الشروق",
    gradient: "from-amber-500/20 to-yellow-400/10",
    icon: Sunrise,
    textColor: "text-amber-400",
  },
  dhuhr: {
    label: "Dhuhr",
    arabic: "الظهر",
    gradient: "from-yellow-500/20 to-amber-400/10",
    icon: Sun,
    textColor: "text-yellow-400",
  },
  asr: {
    label: "Asr",
    arabic: "العصر",
    gradient: "from-orange-500/20 to-amber-500/10",
    icon: CloudSun,
    textColor: "text-orange-400",
  },
  maghrib: {
    label: "Maghrib",
    arabic: "المغرب",
    gradient: "from-rose-500/20 to-orange-500/10",
    icon: Sunset,
    textColor: "text-rose-400",
  },
  isha: {
    label: "Isha",
    arabic: "العشاء",
    gradient: "from-violet-600/20 to-indigo-500/10",
    icon: Moon,
    textColor: "text-violet-400",
  },
};

const PRAYER_ORDER: PrayerName[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date, use24h: boolean): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24h,
  });
}

function formatCountdown(target: Date): string {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "Now";

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PrayersPage() {
  const {
    times,
    currentPrayer,
    nextPrayer,
    nextPrayerTime,
    locationLabel,
    calcMethod,
    setCalcMethod,
    isLoading,
    error,
    refresh,
  } = usePrayerTimes();

  const [use24h, setUse24h] = useState(false);
  const [showMethods, setShowMethods] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live countdown ticker
  useEffect(() => {
    if (!nextPrayerTime) return;
    const tick = () => setCountdown(formatCountdown(nextPrayerTime));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextPrayerTime]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const nextMeta =
    nextPrayer && nextPrayer !== "none" ? PRAYER_META[nextPrayer] : null;

  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 md:mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Prayer Times
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-foreground/50 text-sm">
            <MapPin size={13} />
            <span className="truncate max-w-50">
              {isLoading ? "Locating…" : (locationLabel ?? "Unknown location")}
            </span>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          {/* 12h / 24h toggle */}
          <button
            onClick={() => setUse24h((v) => !v)}
            className="text-xs text-foreground/50 hover:text-foreground/80 border border-card-border rounded-full px-3 py-1.5 transition-colors"
          >
            {use24h ? "24h" : "12h"}
          </button>

          <button
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="p-2 rounded-full bg-card-bg border border-card-border text-foreground/50 hover:text-foreground/80 transition-colors disabled:opacity-40"
            aria-label="Refresh location"
          >
            <RefreshCw
              size={16}
              className={isRefreshing || isLoading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {/* ── Error state ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
          >
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Location unavailable
              </p>
              <p className="text-xs text-foreground/60 mt-0.5">{error}</p>
              <button
                onClick={handleRefresh}
                className="text-xs text-brand-500 hover:text-brand-400 mt-2 font-medium"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading skeleton ─────────────────────────────────────────── */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-20"
        >
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <p className="text-foreground/50 text-sm">Getting your location…</p>
        </motion.div>
      )}

      {/* ── Main content ─────────────────────────────────────────────── */}
      {!isLoading && times && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          {/* Next Prayer Countdown Card */}
          {nextMeta && nextPrayerTime && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-3xl border border-card-border bg-linear-to-br ${nextMeta.gradient} p-5 md:p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-foreground/50 font-semibold mb-1">
                    Next Prayer
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      {nextMeta.label}
                    </h2>
                    <span className="text-lg font-arabic text-foreground/60">
                      {nextMeta.arabic}
                    </span>
                  </div>
                  <p className="text-foreground/60 text-sm mt-1">
                    at {formatTime(nextPrayerTime, use24h)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div
                    className={`p-3 rounded-2xl bg-card-bg/50 ${nextMeta.textColor}`}
                  >
                    <nextMeta.icon size={28} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={13} className="text-foreground/40" />
                    <span className="text-xl font-bold tabular-nums text-foreground">
                      {countdown}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Current prayer indicator */}
          {currentPrayer && currentPrayer !== "none" && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-foreground/60 px-1"
            >
              <CheckCircle2 size={14} className="text-green-500" />
              <span>
                Current prayer:{" "}
                <span className="font-semibold text-foreground">
                  {PRAYER_META[currentPrayer].label}
                </span>
              </span>
            </motion.div>
          )}

          {/* Prayer times list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {PRAYER_ORDER.map((prayer, i) => {
              const meta = PRAYER_META[prayer];
              const PrayerIcon = meta.icon;
              const time = times[prayer];
              const isCurrent = currentPrayer === prayer;
              const isNext = nextPrayer === prayer;

              return (
                <motion.div
                  key={prayer}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                    isCurrent
                      ? "border-green-500/40 bg-green-500/8"
                      : isNext
                        ? `border-card-border bg-linear-to-br ${meta.gradient}`
                        : "border-card-border bg-card-bg/60"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
                      isCurrent
                        ? "bg-green-500/15 text-green-400"
                        : `bg-card-bg/80 ${meta.textColor}`
                    }`}
                  >
                    <PrayerIcon size={20} />
                  </div>

                  {/* Name + time */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-semibold text-foreground text-sm">
                        {meta.label}
                      </span>
                      <span className="text-xs font-arabic text-foreground/40">
                        {meta.arabic}
                      </span>
                    </div>
                    <span className="text-foreground/70 tabular-nums text-base font-medium">
                      {formatTime(time, use24h)}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        Now
                      </span>
                    )}
                    {isNext && !isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50 bg-card-bg/80 px-2 py-0.5 rounded-full border border-card-border">
                        Next
                      </span>
                    )}
                    {prayer === "sunrise" && (
                      <span className="text-[10px] text-foreground/30 italic">
                        not a prayer
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Calculation Method Picker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-card-border bg-card-bg/60 overflow-hidden"
          >
            <button
              onClick={() => setShowMethods((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <span className="font-medium">
                Calculation Method:{" "}
                <span className="text-foreground">
                  {CALCULATION_METHODS[calcMethod].label}
                </span>
              </span>
              {showMethods ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            <AnimatePresence>
              {showMethods && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-card-border divide-y divide-card-border/50">
                    {(Object.keys(CALCULATION_METHODS) as CalcMethodKey[]).map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setCalcMethod(key);
                            setShowMethods(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-card-border/20 ${
                            calcMethod === key
                              ? "text-brand-500 font-semibold"
                              : "text-foreground/70"
                          }`}
                        >
                          {CALCULATION_METHODS[key].label}
                          {calcMethod === key && (
                            <span className="ml-2 text-brand-500">✓</span>
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Date footer */}
          <p className="text-center text-xs text-foreground/30 pt-1">
            {new Date().toLocaleDateString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>
      )}
    </div>
  );
}
