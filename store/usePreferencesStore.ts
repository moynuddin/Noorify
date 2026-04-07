import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PrayerTimesConfig = {
  enabled: boolean;
  city: string;
  country: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  delayMinutes: number; // e.g., remind 10 mins after prayer
};

interface PreferencesState {
  theme: 'dark' | 'light' | 'system';
  prayerConfig: PrayerTimesConfig;
  hapticEnabled: boolean;
  
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  updatePrayerConfig: (config: Partial<PrayerTimesConfig>) => void;
  toggleHaptic: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      prayerConfig: {
        enabled: false,
        city: 'London',
        country: 'UK',
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        delayMinutes: 10,
      },
      hapticEnabled: true,

      setTheme: (theme) => set({ theme }),
      updatePrayerConfig: (config) => set((state) => ({
        prayerConfig: { ...state.prayerConfig, ...config }
      })),
      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),
    }),
    {
      name: 'dhikr-preferences',
    }
  )
);
