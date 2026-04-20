"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MECCA_LAT, MECCA_LNG, SMOOTHING_FACTOR } from "@/constants/qibla";

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

const LOCATION_CACHE_KEY = "dhikr_location_cache";

interface LocationCache {
  lat: number;
  lng: number;
  label: string;
}

function loadLocationCache(): LocationCache | null {
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocationCache;
  } catch {
    return null;
  }
}

function saveLocationCache(lat: number, lng: number, label: string) {
  try {
    localStorage.setItem(
      LOCATION_CACHE_KEY,
      JSON.stringify({ lat, lng, label }),
    );
  } catch {
    // storage not available — ignore
  }
}

export function useQibla() {
  // Compute initial state from cache once via lazy useState initializers.
  // This is the React-idiomatic way: derive correct initial values upfront
  // instead of calling setState synchronously inside an effect.
  const [initFromCache] = useState<{
    qiblaAngle: number | null;
    declination: number;
    hasCached: boolean;
  }>(() => {
    if (typeof window === "undefined") {
      return { qiblaAngle: null, declination: 0, hasCached: false };
    }
    const cached = loadLocationCache();
    if (!cached) return { qiblaAngle: null, declination: 0, hasCached: false };
    const decl = estimateMagneticDeclination(cached.lat, cached.lng);
    return {
      qiblaAngle: calculateQiblaBearing(cached.lat, cached.lng),
      declination: decl,
      hasCached: true,
    };
  });

  const [qiblaAngle, setQiblaAngle] = useState<number | null>(
    initFromCache.qiblaAngle,
  );
  const [heading, setHeading] = useState<number | null>(null);
  const [rawHeading, setRawHeading] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(!initFromCache.hasCached);
  const [accuracy, setAccuracy] = useState<CompassAccuracy>("unknown");
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const [declination, setDeclination] = useState(initFromCache.declination);

  const smoothedRef = useRef<number | null>(null);
  // Initialize ref to match the lazy-initializer value so the compass
  // correction is correct from the very first orientation event.
  const declinationRef = useRef(initFromCache.declination);
  // Track synchronously whether a cached location was applied this session.
  // Using a ref avoids the stale-closure problem that arises when reading
  // React state inside a geolocation error callback on iOS.
  const hasCachedLocationRef = useRef(initFromCache.hasCached);

  // ── 1. Geolocation — fresh fetch, error-suppressed when cache exists ────
  useEffect(() => {
    if (!navigator.geolocation) {
      if (!hasCachedLocationRef.current) {
        setLocationError("Geolocation is not supported by your browser.");
        setIsLocating(false);
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Try Aladhan Qibla API first (authoritative), fall back to local formula
        let angle: number;
        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`,
          );
          const data = await res.json();
          if (data.code === 200 && typeof data.data?.direction === "number") {
            angle = data.data.direction;
          } else {
            angle = calculateQiblaBearing(latitude, longitude);
          }
        } catch {
          angle = calculateQiblaBearing(latitude, longitude);
        }

        const decl = estimateMagneticDeclination(latitude, longitude);
        declinationRef.current = decl;
        setDeclination(decl);
        setQiblaAngle(angle);
        setIsLocating(false);
        setLocationError(null);

        // Persist so next open works without permission
        saveLocationCache(latitude, longitude, "");
      },
      () => {
        // hasCachedLocationRef is a ref — always reflects the current value,
        // even inside this async callback (no stale-closure issue on iOS).
        if (hasCachedLocationRef.current) {
          // Silently keep showing cached data.
          setIsLocating(false);
          return;
        }
        setLocationError(
          "Unable to retrieve your location. Please ensure location services are enabled.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
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
