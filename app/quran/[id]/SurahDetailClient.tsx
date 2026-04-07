"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
import { fetchWithCache } from "@/utils/quranCache";
import { useQuranStore } from "@/store/useQuranStore";

interface Ayah {
  numberInSurah: number;
  text: string;
}

interface SurahData {
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
}

const SURAH_VIRTUES: Record<number, { text: string; reference: string }> = {
  1: { text: "The greatest Surah in the Quran... It is a cure for every disease.", reference: "Bukhari" },
  2: { text: "Recite Surah Al-Baqarah, for to take recourse to it is a blessing and to give it up is a cause of grief.", reference: "Muslim" },
  18: { text: "Whoever reads Surah Al-Kahf on Friday, he will be illuminated with light between the two Fridays.", reference: "Al-Hakim" },
  36: { text: "Everything has a heart, and the heart of the Quran is Yaseen.", reference: "Tirmidhi" },
  67: { text: "There is a Surah of thirty verses which intercedes for a man until he is forgiven.", reference: "Abu Dawud" },
  112: { text: "By Him in Whose Hand is my life, it is equal to one-third of the Quran.", reference: "Bukhari" },
  113: { text: "The clearest words to seek refuge in Allah from evil.", reference: "An-Nasa'i" },
  114: { text: "The clearest words to seek refuge in Allah from evil.", reference: "An-Nasa'i" },
};

export default function SurahDetailClient({ id }: { id: number }) {
  const router = useRouter();
  
  const [arabicData, setArabicData] = useState<SurahData | null>(null);
  const [englishData, setEnglishData] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorOffline, setErrorOffline] = useState(false);

  const { markDownloaded } = useQuranStore();

  useEffect(() => {
    if (!id) return;
    
    async function fetchSurah() {
      try {
        const [arJson, enJson] = await Promise.all([
          fetchWithCache(`https://api.alquran.cloud/v1/surah/${id}/quran-uthmani`),
          fetchWithCache(`https://api.alquran.cloud/v1/surah/${id}/en.asad`)
        ]);

        if (arJson.code === 200 && enJson.code === 200) {
          setArabicData(arJson.data);
          setEnglishData(enJson.data);
          
          markDownloaded(id);
        } else {
          setErrorOffline(true);
        }
      } catch (e) {
        console.error("Failed to fetch surah data", e);
        setErrorOffline(true);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSurah();
  }, [id, markDownloaded]);

  const virtue = SURAH_VIRTUES[id];

  return (
    <div className="px-4 sm:px-8 md:px-12 py-6 md:py-10 pb-32 md:pb-40 min-h-screen transition-all duration-300">
      
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Surahs</span>
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-50">
          <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
          <p className="text-sm font-medium">Loading from Cache or Network...</p>
        </div>
      ) : errorOffline ? (
        <div className="text-center py-20">
           <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <BookOpen size={30} />
           </div>
           <h3 className="text-lg font-bold text-foreground mb-2">Surah Not Found Offline</h3>
           <p className="text-foreground/50 max-w-sm mx-auto text-sm">
             You are offline and haven't downloaded this Surah yet. Please connect to the internet to read or download it.
           </p>
        </div>
      ) : arabicData && englishData ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-500 text-white rounded-3xl p-6 md:p-10 mb-8 shadow-md relative overflow-hidden text-center">
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none" />
            <h1 className="text-3xl md:text-5xl font-bold mb-2 relative z-10">{arabicData.englishName}</h1>
            <p className="text-brand-100 font-medium text-sm md:text-base relative z-10">{arabicData.englishNameTranslation}</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] md:text-xs font-bold tracking-widest uppercase text-brand-100 relative z-10">
              <span className="bg-brand-400/30 px-2 py-0.5 rounded-sm">{arabicData.revelationType}</span>
              <span className="w-1 h-1 rounded-full bg-brand-200" />
              <span>{arabicData.ayahs.length} Ayahs</span>
            </div>
          </div>

          {/* Virtue Box if available */}
          {virtue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3 bg-brand-500/5 border border-brand-500/20 px-5 py-4 rounded-2xl mb-8"
            >
              <BookOpen size={20} className="text-brand-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed italic mb-1">
                  "{virtue.text}"
                </p>
                <p className="text-[10px] md:text-xs text-brand-500 font-bold uppercase tracking-wider">
                  — {virtue.reference}
                </p>
              </div>
            </motion.div>
          )}

          {/* Ayahs List */}
          <div className="space-y-6 md:space-y-8">
            {arabicData.ayahs.map((ayah, i) => (
              <motion.div 
                key={ayah.numberInSurah}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-card-bg border border-card-border p-5 md:p-8 rounded-3xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-4 border-b border-card-border/50 pb-4">
                  <span className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center text-[10px] md:text-xs font-bold text-foreground/50">
                    {ayah.numberInSurah}
                  </span>
                </div>
                
                <p 
                  className="font-arabic text-2xl md:text-4xl text-right text-brand-600 dark:text-brand-400 mb-6 leading-loose drop-shadow-sm" 
                  dir="rtl"
                >
                  {ayah.text}
                </p>
                
                <p className="text-foreground/70 text-sm md:text-base leading-relaxed">
                  {englishData.ayahs[i]?.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
