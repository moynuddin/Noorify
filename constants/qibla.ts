/** Geographic coordinates of the Masjid al-Haram (Kaaba), Makkah. */
export const MECCA_LAT = 21.422487;
export const MECCA_LNG = 39.826206;

/**
 * Low-pass filter coefficient for compass smoothing (0 = ignore new, 1 = ignore old).
 * Lower = smoother but slower to react.
 */
export const SMOOTHING_FACTOR = 0.15;
