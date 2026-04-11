"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────
const MECCA_LAT = 21.422487;
const MECCA_LNG = 39.826206;

// Low-pass filter coefficient (0 = ignore new, 1 = ignore old).
// Lower = smoother but slower to react. 0.15 is a good balance.
const SMOOTHING_FACTOR = 0.15;

// ─── Helpers ─────────────────────────────────────────────────────────
function toRadians(deg: number) {
  return deg * (Math.PI / 180);
}
function toDegrees(rad: number) {
  return rad * (180 / Math.PI);
}

/**
 * Great-circle initial bearing from (lat, lng) → Mecca.
 * Returns degrees 0-360 from True North.
 */
function calculateQiblaBearing(lat: number, lng: number): number {
  const p1 = toRadians(lat);
  const p2 = toRadians(MECCA_LAT);
  const dL = toRadians(MECCA_LNG - lng);

  const y = Math.sin(dL) * Math.cos(p2);
  const x =
    Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dL);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Estimate magnetic declination using a simplified dipole model.
 * Accuracy is about 1-2 degrees for most populated regions —
 * good enough given consumer phone magnetometers already have ~5 degree noise.
 */
function estimateMagneticDeclination(lat: number, lng: number): number {
  const p = toRadians(lat);
  const l = toRadians(lng);

  const decl =
    -2.09 * Math.sin(p) * Math.cos(l) +
    5.53 * Math.cos(p) * Math.sin(l) +
    2.78 * Math.sin(2 * p) -
    0.75 * Math.cos(2 * p) * Math.sin(l);

  return decl;
}

/**
 * Circular low-pass filter that handles the 0/360 wrap-around correctly.
 * Standard linear interpolation breaks when values cross the boundary
 * (e.g. 350 to 10 would incorrectly interpolate through 180).
 */
function smoothAngle(
  previous: number | null,
  current: number,
  alpha: number,
): number {
  if (previous === null) return current;

  const prevRad = toRadians(previous);
  const currRad = toRadians(current);

  const sinAvg = (1 - alpha) * Math.sin(prevRad) + alpha * Math.sin(currRad);
  const cosAvg = (1 - alpha) * Math.cos(prevRad) + alpha * Math.cos(currRad);

  return (toDegrees(Math.atan2(sinAvg, cosAvg)) + 360) % 360;
}

// ─── Accuracy level ──────────────────────────────────────────────────
export type CompassAccuracy = "unknown" | "low" | "medium" | "high";

function classifyAccuracy(event: DeviceOrientationEvent): CompassAccuracy {
  // webkitCompassAccuracy is available on iOS (degrees of error)
  const acc = (event as any).webkitCompassAccuracy as number | undefined;
  if (acc !== undefined) {
    if (acc < 0) return "unknown";
    if (acc <= 10) return "high";
    if (acc <= 25) return "medium";
    return "low";
  }
  if ((event as any).absolute === true) return "medium";
  return "unknown";
}

// ─── Hook ────────────────────────────────────────────────────────────
export function useQibla() {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [rawHeading, setRawHeading] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [accuracy, setAccuracy] = useState<CompassAccuracy>("unknown");
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const [declination, setDeclination] = useState(0);

  const smoothedRef = useRef<number | null>(null);
  const declinationRef = useRef(0);

  // ── 1. Geolocation ──────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Try Aladhan Qibla API first (authoritative), fall back to local formula
        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`,
          );
          const data = await res.json();
          if (data.code === 200 && typeof data.data?.direction === "number") {
            setQiblaAngle(data.data.direction);
          } else {
            setQiblaAngle(calculateQiblaBearing(latitude, longitude));
          }
        } catch {
          setQiblaAngle(calculateQiblaBearing(latitude, longitude));
        }

        const decl = estimateMagneticDeclination(latitude, longitude);
        setDeclination(decl);
        declinationRef.current = decl;
        setIsLocating(false);
      },
      () => {
        setLocationError(
          "Unable to retrieve your location. Please ensure location services are enabled.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  // ── 2. Orientation handler ──────────────────────────────────────
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let compass: number | null = null;
    let trueNorth = false;

    // iOS Safari: webkitCompassHeading is already TRUE north
    if ("webkitCompassHeading" in event) {
      compass = (event as any).webkitCompassHeading as number;
      trueNorth = true;
    } else if (event.alpha !== null) {
      compass = (360 - event.alpha) % 360;
    }

    if (compass === null) {
      // Desktop browsers fire deviceorientation events with null alpha —
      // only report the error once; the static Qibla angle is still valid.
      setCompassError(null); // suppress repeated error noise
      return;
    }

    // Apply magnetic declination correction for magnetic-only readings
    if (!trueNorth) {
      compass = (compass + declinationRef.current + 360) % 360;
    }

    setRawHeading(compass);

    // Apply circular low-pass filter for smooth animation
    const smoothed = smoothAngle(
      smoothedRef.current,
      compass,
      SMOOTHING_FACTOR,
    );
    smoothedRef.current = smoothed;
    setHeading(smoothed);
    setCompassError(null);

    // Evaluate accuracy & calibration need
    const acc = classifyAccuracy(event);
    setAccuracy(acc);
    setNeedsCalibration(acc === "low" || acc === "unknown");
  }, []);

  // ── 3. Start compass listener ──────────────────────────────────
  const startCompassListener = useCallback(() => {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation as EventListener,
        true,
      );
    } else if ("ondeviceorientation" in window) {
      (window as any).addEventListener(
        "deviceorientation",
        handleOrientation as EventListener,
        true,
      );
    } else {
      setCompassError("Device compass is not supported on this browser.");
    }
  }, [handleOrientation]);

  // ── 4. iOS permission flow ──────────────────────────────────────
  const requestCompassPermission = useCallback(async () => {
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const state = await (DeviceOrientationEvent as any).requestPermission();
        if (state === "granted") {
          startCompassListener();
          setCompassError(null);
        } else {
          setCompassError(
            "Permission to access device orientation was denied.",
          );
        }
      } catch {
        setCompassError("Error requesting device orientation permission.");
      }
    } else {
      startCompassListener();
    }
  }, [startCompassListener]);

  // ── 5. Auto-start on non-iOS ───────────────────────────────────
  useEffect(() => {
    if (
      typeof (DeviceOrientationEvent as any).requestPermission !== "function"
    ) {
      startCompassListener();
    }

    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation as EventListener,
        true,
      );
      (window as any).removeEventListener(
        "deviceorientation",
        handleOrientation as EventListener,
        true,
      );
    };
  }, [startCompassListener, handleOrientation]);

  return {
    qiblaAngle,
    heading,
    rawHeading,
    declination,
    accuracy,
    needsCalibration,
    locationError,
    compassError,
    isLocating,
    requestCompassPermission,
  };
}
