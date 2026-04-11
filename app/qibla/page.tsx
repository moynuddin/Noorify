"use client";

import { useQibla } from "@/hooks/useQibla";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, MapPin, Info, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

const ACCURACY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: "High Accuracy", color: "text-green-500" },
  medium: { label: "Medium Accuracy", color: "text-yellow-500" },
  low: { label: "Low — Calibrate", color: "text-orange-500" },
  unknown: { label: "Calibrating…", color: "text-foreground/40" },
};

export default function QiblaPage() {
  const {
    qiblaAngle,
    heading,
    locationError,
    compassError,
    isLocating,
    requestCompassPermission,
    accuracy,
    needsCalibration,
    declination,
  } = useQibla();

  const [needsPermission, setNeedsPermission] = useState(false);
  const [showCalibrationTip, setShowCalibrationTip] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof (window as any).DeviceOrientationEvent !== "undefined"
    ) {
      if (
        typeof (window.DeviceOrientationEvent as any).requestPermission ===
        "function"
      ) {
        setNeedsPermission(true);
      }
    }
  }, []);

  // Show calibration tip when accuracy is bad
  useEffect(() => {
    if (needsCalibration && heading !== null) {
      setShowCalibrationTip(true);
    }
  }, [needsCalibration, heading]);

  const handleStartCompass = async () => {
    await requestCompassPermission();
    setNeedsPermission(false);
  };

  const isPointingToKaaba =
    heading !== null &&
    qiblaAngle !== null &&
    (Math.abs((heading - qiblaAngle + 360) % 360) < 5 ||
      Math.abs((heading - qiblaAngle + 360) % 360) > 355);

  const accInfo = ACCURACY_LABELS[accuracy] ?? ACCURACY_LABELS.unknown;

  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 min-h-[80vh] flex flex-col items-center justify-center transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mb-8 text-center"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground flex items-center justify-center gap-2">
          <Compass className="text-brand-500" size={28} />
          Qibla Locator
        </h1>
        <p className="text-sm text-foreground/60">
          Find the direction of the Kaaba
        </p>
      </motion.div>

      {isLocating ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full"
          />
          <p className="text-foreground/70 text-sm font-medium">
            Acquiring Location…
          </p>
        </div>
      ) : locationError ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center text-center">
          <MapPin className="text-red-500 mb-3" size={32} />
          <h3 className="font-semibold text-red-600 mb-2">Location Required</h3>
          <p className="text-sm text-foreground/80">{locationError}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center w-full max-w-xs"
        >
          {/* ── Calibration Tip ──────────────────────────────── */}
          <AnimatePresence>
            {showCalibrationTip && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 w-full relative"
              >
                <RotateCcw
                  className="text-amber-500 shrink-0 mt-0.5 animate-spin"
                  style={{ animationDuration: "3s" }}
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                    Calibrate Your Compass
                  </p>
                  <p className="text-[11px] text-foreground/70 leading-relaxed">
                    Move your phone in a figure-8 pattern several times to
                    improve accuracy. Stay away from metal objects and magnets.
                  </p>
                </div>
                <button
                  onClick={() => setShowCalibrationTip(false)}
                  className="text-foreground/30 hover:text-foreground/60 text-xs font-bold absolute top-2 right-3"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Compass Error ────────────────────────────────── */}
          {compassError && !needsPermission && (
            <div className="mb-6 p-4 bg-foreground/5 border border-card-border rounded-xl flex items-start gap-3 w-full">
              <Info className="text-foreground/40 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-foreground/60 leading-relaxed">
                Live compass requires a mobile device with a magnetometer
                sensor. The Qibla angle shown above is still accurate for your
                location.
              </p>
            </div>
          )}

          {/* ── iOS Permission Overlay ───────────────────────── */}
          {needsPermission && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6 text-center">
              <Compass className="w-16 h-16 text-brand-500 mb-4 opacity-80" />
              <h2 className="text-lg font-semibold mb-2">
                Compass Calibration
              </h2>
              <p className="text-sm text-foreground/70 mb-6">
                Device orientation access is required to use the compass
                feature.
              </p>
              <button
                onClick={handleStartCompass}
                className="px-6 py-2.5 bg-brand-500 text-white font-medium rounded-full shadow-lg hover:bg-brand-600 active:scale-95 transition-all"
              >
                Enable Compass
              </button>
            </div>
          )}

          {/* ── Compass Dial ─────────────────────────────────── */}
          <div className="relative w-full aspect-square max-w-[300px] flex items-center justify-center">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-[12px] border-card-bg shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] z-0" />

            {/* Inner Compass Card */}
            <motion.div
              className="absolute inset-[10px] rounded-full border border-card-border/50 bg-gradient-to-br from-card-bg to-card-bg/80 flex items-center justify-center shadow-inner"
              animate={heading !== null ? { rotate: -heading } : {}}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
              <div className="absolute top-4 text-sm font-bold text-red-500">
                N
              </div>
              <div className="absolute bottom-4 text-sm font-bold text-foreground/40">
                S
              </div>
              <div className="absolute right-4 text-sm font-bold text-foreground/40">
                E
              </div>
              <div className="absolute left-4 text-sm font-bold text-foreground/40">
                W
              </div>

              {/* Tick Marks */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-0.5 h-3 ${
                    i % 3 === 0 ? "bg-foreground/30" : "bg-foreground/10"
                  }`}
                  style={{
                    transform: `rotate(${i * 30}deg) translateY(-110px)`,
                  }}
                />
              ))}
            </motion.div>

            {/* Qibla Direction Indicator */}
            {qiblaAngle !== null && (
              <motion.div
                className="absolute inset-0 flex items-start justify-center pt-8 pointer-events-none z-10"
                animate={
                  heading !== null
                    ? { rotate: qiblaAngle - heading }
                    : { rotate: qiblaAngle }
                }
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`text-4xl filter drop-shadow-md transition-transform duration-300 ${
                      isPointingToKaaba ? "scale-125" : "scale-100"
                    }`}
                  >
                    🕋
                  </div>
                  <div
                    className={`w-1 h-32 rounded-full mt-2 transition-colors duration-300 ${
                      isPointingToKaaba
                        ? "bg-brand-500 shadow-[0_0_15px_rgba(52,168,143,0.6)]"
                        : "bg-brand-500/40"
                    }`}
                  />
                </div>
              </motion.div>
            )}

            {/* Center Pivot */}
            <div className="absolute w-4 h-4 bg-brand-600 rounded-full border-2 border-white shadow-md z-20" />

            {/* Success Glow */}
            {isPointingToKaaba && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-[-20px] rounded-full border-2 border-brand-500/30 bg-brand-500/5 blur-sm z-[-1]"
              />
            )}
          </div>

          {/* ── Info Panel ───────────────────────────────────── */}
          <div className="mt-10 text-center bg-card-bg/60 border border-card-border px-6 py-5 rounded-2xl shadow-sm backdrop-blur-xl w-full space-y-3">
            {/* Qibla Angle */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-500 mb-1">
                Qibla Angle
              </p>
              <p className="text-3xl font-semibold tabular-nums text-foreground">
                {qiblaAngle ? `${qiblaAngle.toFixed(1)}°` : "--°"}
              </p>
            </div>

            {/* Current heading + Accuracy */}
            {heading !== null && (
              <div className="flex items-center justify-center gap-4 text-xs text-foreground/50 uppercase tracking-wide font-medium">
                <span>Heading: {heading.toFixed(1)}°</span>
                <span className="text-foreground/20">|</span>
                <span className={accInfo.color}>{accInfo.label}</span>
              </div>
            )}

            {/* Declination correction info */}
            {declination !== 0 && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-foreground/40 font-medium">
                <Info size={12} />
                <span>
                  Magnetic declination {declination > 0 ? "+" : ""}
                  {declination.toFixed(1)}° applied
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
