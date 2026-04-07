"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Loader2, DownloadCloud, CheckCircle2 } from "lucide-react";
import { fetchWithCache, downloadSurahOffline, removeSurahFromCache } from "@/utils/quranCache";
import { useQuranStore } from "@/store/useQuranStore";

interface SurahMeta {
  number: number;
  name: string; // Arabic name
  englishName: string; // Transliterated name
  englishNameTranslation: string; // Meaning
  numberOfAyahs: number;
  revelationType: string;
}

export default function QuranList() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [totalToDownload, setTotalToDownload] = useState(0);
  
  const { downloadedSurahs, markDownloaded, removeDownloaded } = useQuranStore();

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const data = await fetchWithCache("https://api.alquran.cloud/v1/surah");
        if (data.code === 200) {
          setSurahs(data.data);
        }
      } catch (e) {
        console.error("Failed to fetch surahs", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const handleDownload = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle deletion if already downloaded
    if (downloadedSurahs.includes(id)) {
      await removeSurahFromCache(id);
      removeDownloaded(id);
      return;
    }

    setDownloadingId(id);
    try {
      await downloadSurahOffline(id);
      markDownloaded(id);
    } catch (error) {
      console.error("Failed downloading surah", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    const missingSurahs = surahs.filter(s => !downloadedSurahs.includes(s.number));
    
    if (missingSurahs.length === 0) return;
    
    setIsDownloadingAll(true);
    setTotalToDownload(missingSurahs.length);
    setDownloadProgress(0);

    let count = 0;
    // Download in batches of 4 to prevent API rate limiting (429 errors)
    const BATCH_SIZE = 4;
    
    for (let i = 0; i < missingSurahs.length; i += BATCH_SIZE) {
      const batch = missingSurahs.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (surah) => {
          try {
            await downloadSurahOffline(surah.number);
            markDownloaded(surah.number);
          } catch (e) {
            console.error(`Failed to download surah ${surah.number}`, e);
          }
        })
      );
      count += batch.length;
      setDownloadProgress(Math.min(count, missingSurahs.length));
    }

    setIsDownloadingAll(false);
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.englishNameTranslation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 min-h-screen pb-32 md:pb-40 transition-all duration-300">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-6 tracking-tight text-foreground flex justify-between items-center"
      >
        The Holy Quran

        {!loading && surahs.length > 0 && (
          <button 
            onClick={handleDownloadAll}
            disabled={isDownloadingAll || downloadedSurahs.length === 114}
            className={`text-xs md:text-sm px-3 md:px-5 py-2 font-semibold text-white rounded-full flex items-center gap-2 transition-all shadow-sm ${
              downloadedSurahs.length === 114 
                ? 'bg-brand-500/50 cursor-not-allowed shadow-none' 
                : 'bg-brand-500 hover:bg-brand-600 active:scale-95'
            }`}
          >
            {isDownloadingAll ? (
              <>
                <Loader2 size={16} className="animate-spin text-brand-100" />
                <span>{downloadProgress}/{totalToDownload}</span>
              </>
            ) : downloadedSurahs.length === 114 ? (
              <>
                <CheckCircle2 size={16} />
                <span>All Cached</span>
              </>
            ) : (
              <>
                <DownloadCloud size={16} />
                <span className="hidden sm:inline">Download All</span>
                <span className="sm:hidden">All</span>
              </>
            )}
          </button>
        )}
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-foreground/40" />
        </div>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Surah name or meaning..." 
          className="w-full bg-card-bg border border-card-border rounded-2xl pl-10 pr-4 py-3.5 text-sm md:text-base outline-none focus:border-brand-500 shadow-sm transition-all"
        />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20 opacity-50">
          <Loader2 className="animate-spin text-brand-500" size={32} />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSurahs.map((surah, i) => {
            const isDownloaded = downloadedSurahs.includes(surah.number);
            const isDownloading = downloadingId === surah.number;

            return (
              <motion.div 
                key={surah.number}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (i < 20 ? i * 0.05 : 0) }}
                className="relative"
              >
                <Link href={`/quran/${surah.number}`} className="block bg-card-bg border border-card-border p-4 md:p-5 rounded-2xl shadow-sm hover:border-brand-500/50 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    {/* Left Side: Number + English Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-foreground/5 rounded-xl flex flex-col items-center justify-center font-bold text-sm md:text-base text-foreground/70 group-hover:bg-brand-500/10 group-hover:text-brand-600 transition-colors shrink-0">
                        {surah.number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-base md:text-lg text-foreground group-hover:text-brand-600 transition-colors flex items-center gap-2">
                          {surah.englishName}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] md:text-xs text-foreground/50 uppercase tracking-wider font-semibold">{surah.revelationType}</span>
                          <span className="w-1 h-1 rounded-full bg-foreground/30" />
                          <span className="text-[10px] md:text-xs text-foreground/50 font-medium">{surah.numberOfAyahs} Ayahs</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side: Arabic Name + Download Icon */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                         <p className="font-arabic text-xl md:text-2xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-500 transition-colors drop-shadow-sm mb-1" dir="rtl">
                           {surah.name}
                         </p>
                         <p className="text-[9px] md:text-[10px] text-foreground/40 tracking-wider uppercase font-bold">
                            {surah.englishNameTranslation}
                         </p>
                      </div>

                      {/* Download Action */}
                      <button 
                        onClick={(e) => handleDownload(e, surah.number)}
                        className={`p-2 rounded-full transition-all flex items-center justify-center ${
                          isDownloaded 
                          ? "bg-brand-500/10 text-brand-500 hover:bg-red-500/10 hover:text-red-500" 
                          : "bg-foreground/5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground/70"
                        }`}
                        title={isDownloaded ? "Remove from offline cache" : "Download for offline"}
                      >
                        {isDownloading ? (
                          <Loader2 size={18} className="animate-spin text-brand-500" />
                        ) : isDownloaded ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <DownloadCloud size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          {filteredSurahs.length === 0 && (
            <p className="text-center py-10 text-foreground/50 font-medium">No Surah found.</p>
          )}
        </div>
      )}
    </div>
  );
}
