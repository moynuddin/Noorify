import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuranState {
  downloadedSurahs: number[];
  markDownloaded: (id: number) => void;
  removeDownloaded: (id: number) => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set) => ({
      downloadedSurahs: [],
      markDownloaded: (id) => set((state) => ({ 
        downloadedSurahs: state.downloadedSurahs.includes(id) 
          ? state.downloadedSurahs 
          : [...state.downloadedSurahs, id] 
      })),
      removeDownloaded: (id) => set((state) => ({ 
        downloadedSurahs: state.downloadedSurahs.filter(s => s !== id) 
      })),
    }),
    {
      name: 'quran-downloads-state',
    }
  )
);
