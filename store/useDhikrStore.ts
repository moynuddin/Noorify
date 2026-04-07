import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type DhikrType = {
  id: string;
  name: string;
  target: number;
  arabic?: string;
  meaning?: string;
  virtue?: string;
  virtueReference?: string;
};

export const PREDEFINED_DHIKRS: DhikrType[] = [
  { id: 'subhanallah', name: 'SubhanAllah', target: 33, arabic: 'سُبْحَانَ ٱللَّٰهِ', meaning: 'Glory be to Allah', virtue: 'Fills the space between heaven and earth with reward.', virtueReference: 'Muslim' },
  { id: 'alhamdulillah', name: 'Alhamdulillah', target: 33, arabic: 'ٱلْحَمْدُ لِلَّٰهِ', meaning: 'All praise is due to Allah', virtue: 'Fills the scales (of good deeds).', virtueReference: 'Muslim' },
  { id: 'allahuakbar', name: 'Allahu Akbar', target: 34, arabic: 'ٱللَّٰهُ أَكْبَرُ', meaning: 'Allah is the Greatest', virtue: 'Whoever says it 100 times, none will bring a better deed than him, except one who does more.', virtueReference: 'Ahmad' },
  { id: 'astaghfirullah', name: 'Astaghfirullah', target: 100, arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', meaning: 'I seek forgiveness from Allah', virtue: 'Allah will provide a way out of every worldly distress and anxiety.', virtueReference: 'Abu Dawud' },
  { id: 'salawat', name: 'Salawat', target: 100, arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', meaning: 'O Allah, send blessings upon Muhammad', virtue: 'Whoever sends one blessing upon me, Allah will send ten blessings upon him.', virtueReference: 'Muslim' }
];

interface DailyRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

interface DhikrState {
  currentDhikr: DhikrType;
  currentCount: number;
  totalLifetimeCount: number;
  history: DailyRecord[];
  streaks: {
    current: number;
    best: number;
    lastActiveDate: string | null;
  };
  customDhikrs: DhikrType[];
  dailyChallenge: {
    date: string;
    dhikrId: string;
    progress: number;
    target: number;
    completed: boolean;
  };
  badges: string[];
  globalCommunityCount: number; // For the MVP simulation of community pool
  
  // Actions
  increment: () => void;
  resetCounter: () => void;
  setDhikr: (dhikr: DhikrType) => void;
  addCustomDhikr: (dhikr: DhikrType) => void;
  unlockBadge: (badgeId: string) => void;
  incrementGlobalSimulation: () => void;
}

export const useDhikrStore = create<DhikrState>()(
  persist(
    (set, get) => ({
      currentDhikr: PREDEFINED_DHIKRS[0],
      currentCount: 0,
      totalLifetimeCount: 0,
      history: [],
      streaks: {
        current: 0,
        best: 0,
        lastActiveDate: null,
      },
      customDhikrs: [],
      dailyChallenge: {
        date: '',
        dhikrId: 'salawat',
        progress: 0,
        target: 100,
        completed: false
      },
      badges: [],
      globalCommunityCount: 840293,

      increment: () => set((state) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const newCount = state.currentCount + 1;
        const newLifetime = state.totalLifetimeCount + 1;
        
        // Update history
        const existingRecordIndex = state.history.findIndex(r => r.date === today);
        let newHistory = [...state.history];
        
        if (existingRecordIndex >= 0) {
          newHistory[existingRecordIndex] = {
            ...newHistory[existingRecordIndex],
            count: newHistory[existingRecordIndex].count + 1
          };
        } else {
          newHistory.push({ date: today, count: 1 });
        }

        // Daily Challenge Update
        let newChallenge = { ...state.dailyChallenge };
        if (newChallenge.date !== today) {
          // New day, generic challenge rotation
          const challenges = ['salawat', 'astaghfirullah', 'subhanallah', 'alhamdulillah', 'allahuakbar'];
          const randomId = challenges[new Date().getDate() % challenges.length];
          newChallenge = { date: today, dhikrId: randomId, progress: 0, target: 100, completed: false };
        }
        
        if (state.currentDhikr.id === newChallenge.dhikrId && !newChallenge.completed) {
          newChallenge.progress += 1;
          if (newChallenge.progress >= newChallenge.target) {
            newChallenge.completed = true;
          }
        }

        // Update streaks
        let newStreaks = { ...state.streaks };
        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
        
        if (state.streaks.lastActiveDate !== today) {
          if (state.streaks.lastActiveDate === yesterday) {
            newStreaks.current += 1;
          } else if (!state.streaks.lastActiveDate || state.streaks.lastActiveDate < yesterday) {
            newStreaks.current = 1; // reset streak if missed a day
          }
          newStreaks.lastActiveDate = today;
          if (newStreaks.current > newStreaks.best) {
            newStreaks.best = newStreaks.current;
          }
        }

        // Check for vibration/haptic feedback natively
        try {
           if (newCount === state.currentDhikr.target) {
             Haptics.impact({ style: ImpactStyle.Heavy });
           } else {
             Haptics.impact({ style: ImpactStyle.Light });
           }
        } catch (e) {
            // Web fallback if running browser instead of native wrapper
            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
               window.navigator.vibrate(newCount === state.currentDhikr.target ? 200 : 50);
            }
        }

        return { 
          currentCount: newCount,
          totalLifetimeCount: newLifetime,
          history: newHistory,
          streaks: newStreaks,
          dailyChallenge: newChallenge
        };
      }),

      resetCounter: () => set({ currentCount: 0 }),
      
      setDhikr: (dhikr) => set({ currentDhikr: dhikr, currentCount: 0 }),
      
      addCustomDhikr: (dhikr) => set((state) => ({ 
        customDhikrs: [...state.customDhikrs, dhikr] 
      })),

      unlockBadge: (badgeId) => set((state) => {
        if (!state.badges.includes(badgeId)) {
          return { badges: [...state.badges, badgeId] };
        }
        return state;
      }),

      incrementGlobalSimulation: () => set((state) => ({
        globalCommunityCount: state.globalCommunityCount + Math.floor(Math.random() * 5) + 1
      }))
    }),
    {
      name: 'dhikr-storage',
    }
  )
);
