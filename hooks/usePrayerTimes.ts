"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PrayerName =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";

export type CalcMethodKey =
  | "MuslimWorldLeague"
  | "NorthAmerica"
  | "Egyptian"
  | "Karachi"
  | "UmmAlQura"
  | "Dubai"
  | "Kuwait"
  | "Qatar"
  | "Singapore"
  | "Tehran"
  | "Turkey";

// ─── Calculation Methods ──────────────────────────────────────────────────────

export const CALCULATION_METHODS: Record<
  CalcMethodKey,
  {
    label: string;
    fn: () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>;
  }
> = {
  MuslimWorldLeague: {
    label: "Muslim World League",
    fn: CalculationMethod.MuslimWorldLeague,
  },
  NorthAmerica: {
    label: "North America (ISNA)",
    fn: CalculationMethod.NorthAmerica,
  },
  Egyptian: { label: "Egyptian", fn: CalculationMethod.Egyptian },
  Karachi: { label: "Karachi", fn: CalculationMethod.Karachi },
  UmmAlQura: { label: "Umm Al-Qura (Makkah)", fn: CalculationMethod.UmmAlQura },
  Dubai: { label: "Dubai", fn: CalculationMethod.Dubai },
  Kuwait: { label: "Kuwait", fn: CalculationMethod.Kuwait },
  Qatar: { label: "Qatar", fn: CalculationMethod.Qatar },
  Singapore: { label: "Singapore", fn: CalculationMethod.Singapore },
  Tehran: { label: "Tehran", fn: CalculationMethod.Tehran },
  Turkey: { label: "Turkey", fn: CalculationMethod.Turkey },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UsePrayerTimesReturn {
  times: Record<PrayerName, Date> | null;
  currentPrayer: PrayerName | "none" | null;
  nextPrayer: PrayerName | "none" | null;
  nextPrayerTime: Date | null;
  locationLabel: string | null;
  calcMethod: CalcMethodKey;
  setCalcMethod: (method: CalcMethodKey) => void;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function usePrayerTimes(): UsePrayerTimesReturn {
  // ── Location state (all in one object → single setState per update) ───────
  // Lazy initializer handles the "not supported" case at render time,
  // keeping the geolocation effect body free of synchronous setState calls.
  const [locationState, setLocationState] = useState<{
    coords: { lat: number; lng: number } | null;
    label: string | null;
    error: string | null;
    isLoading: boolean;
  }>(() => {
    const supported =
      typeof window !== "undefined" && Boolean(navigator?.geolocation);
    return {
      coords: null,
      label: null,
      error: supported ? null : "Geolocation is not supported by your browser.",
      isLoading: supported,
    };
  });

  const [calcMethod, setCalcMethod] =
    useState<CalcMethodKey>("MuslimWorldLeague");

  // Tick every minute so prayer current/next updates without re-fetching location
  const [now, setNow] = useState(() => new Date());

  // Incrementing this triggers a fresh geolocation fetch
  const [refreshKey, setRefreshKey] = useState(0);

  // refresh() is called from UI event handlers only (never from effects).
  // Guard against unsupported browsers so it doesn't trigger a no-op cycle.
  const refresh = useCallback(() => {
    if (typeof window === "undefined" || !navigator?.geolocation) return;
    setLocationState((prev) => ({ ...prev, isLoading: true, error: null }));
    setRefreshKey((k) => k + 1);
  }, []);

  // ── Geolocation effect ────────────────────────────────────────────────────
  // Depends on refreshKey: runs on mount (key=0) and on every manual refresh.
  // All setState calls are inside async callbacks, never in the effect body,
  // so the React Compiler is happy.
  useEffect(() => {
    let cancelled = false;

    // If not supported, initial state already reflects this — just return.
    if (!navigator?.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (cancelled) return;
        const { latitude, longitude } = position.coords;

        // Reverse-geocode for a human-readable city name
        let label = `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "Accept-Language": "en",
                "User-Agent":
                  "DhikrApp/1.0 (personal Islamic productivity app)",
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address ?? {};
            const city =
              addr.city ?? addr.town ?? addr.village ?? addr.county ?? "";
            const country = addr.country ?? "";
            if (city || country) {
              label = city ? `${city}, ${country}` : country;
            }
          }
        } catch {
          // keep coordinate fallback label
        }

        if (!cancelled) {
          setLocationState({
            coords: { lat: latitude, lng: longitude },
            label,
            error: null,
            isLoading: false,
          });
        }
      },
      (err) => {
        if (!cancelled) {
          setLocationState((prev) => ({
            ...prev,
            error: err.message || "Unable to get your location.",
            isLoading: false,
          }));
        }
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60 * 1000 },
    );

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // ── Minute ticker ─────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Derived prayer data (no effects, no cascading setState) ───────────────
  // Prayer times are fully derived from coords + calcMethod + current time.
  const prayerData = useMemo(() => {
    const { coords } = locationState;
    if (!coords) return null;

    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = CALCULATION_METHODS[calcMethod].fn();
    const pt = new PrayerTimes(coordinates, now, params);

    const current = pt.currentPrayer() as PrayerName | "none";
    const next = pt.nextPrayer() as PrayerName | "none";

    let nextTime: Date | null =
      next !== "none" ? pt.timeForPrayer(next as PrayerName) : null;

    if (!nextTime) {
      // All prayers done for today — show tomorrow's Fajr
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowPt = new PrayerTimes(coordinates, tomorrow, params);
      nextTime = tomorrowPt.fajr;
    }

    return {
      times: {
        fajr: pt.fajr,
        sunrise: pt.sunrise,
        dhuhr: pt.dhuhr,
        asr: pt.asr,
        maghrib: pt.maghrib,
        isha: pt.isha,
      } satisfies Record<PrayerName, Date>,
      currentPrayer: current,
      nextPrayer: next,
      nextPrayerTime: nextTime,
    };
  }, [locationState, calcMethod, now]);

  return {
    times: prayerData?.times ?? null,
    currentPrayer: prayerData?.currentPrayer ?? null,
    nextPrayer: prayerData?.nextPrayer ?? null,
    nextPrayerTime: prayerData?.nextPrayerTime ?? null,
    locationLabel: locationState.label,
    calcMethod,
    setCalcMethod,
    isLoading: locationState.isLoading,
    error: locationState.error,
    refresh,
  };
}
