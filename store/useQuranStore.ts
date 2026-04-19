import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TranslationOption = 'en.sahih' | 'en.asad' | 'hi.hindi';

interface QuranState {
  downloadedSurahs: number[];
  selectedTranslation: TranslationOption;
  markDownloaded: (id: number) => void;
  removeDownloaded: (id: number) => void;
  setTranslation: (translation: TranslationOption) => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set) => ({
      downloadedSurahs: [],
      selectedTranslation: 'en.sahih', // default to simpler English
      markDownloaded: (id) => set((state) => ({ 
        downloadedSurahs: state.downloadedSurahs.includes(id) 
          ? state.downloadedSurahs 
          : [...state.downloadedSurahs, id] 
      })),
      removeDownloaded: (id) => set((state) => ({ 
        downloadedSurahs: state.downloadedSurahs.filter(s => s !== id) 
      })),
      setTranslation: (translation) => set({ selectedTranslation: translation }),
    }),
    {
      name: 'quran-downloads-state',
    }
  )
);
