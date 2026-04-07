"use client";

import { motion } from "framer-motion";

const DUAS_CATEGORIES = [
  {
    id: "rizq",
    title: "Rizq (Sustenance)",
    icon: "🌾",
    duas: [
      {
        id: 1,
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
        transliteration: "Allahumma inni as'aluka 'ilman naafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan",
        meaning: "O Allah, I ask You for beneficial knowledge, goodly provision and acceptable deeds.",
        reference: "Ibn Majah"
      }
    ]
  },
  {
    id: "health",
    title: "Health & Protection",
    icon: "🛡️",
    duas: [
      {
        id: 2,
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ",
        transliteration: "Allahumma aafinee fee badanee, allahumma aafinee fee sam'ee, allahumma aafinee fee basaree, laa ilaaha illaa ant",
        meaning: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You.",
        reference: "Abu Dawud"
      }
    ]
  },
  {
    id: "peace",
    title: "Peace & Anxiety",
    icon: "🕊️",
    duas: [
      {
        id: 3,
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-huzni, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal",
        meaning: "O Allah, I seek refuge in You from grief and sadness, from weakness and from laziness, from miserliness and from cowardice, from being overcome by debt and from oppression of men.",
        reference: "Sahih Al-Bukhari"
      }
    ]
  }
];

export default function DuasPage() {
  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 min-h-screen transition-all duration-300">
      <motion.h1 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 tracking-tight text-foreground"
      >
        Daily Duas
      </motion.h1>

      <div className="space-y-8 md:space-y-12">
        {DUAS_CATEGORIES.map((cat, i) => (
          <motion.div 
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 pl-2">
              <span className="text-xl md:text-3xl">{cat.icon}</span>
              <h2 className="text-lg md:text-xl font-semibold text-foreground/80">{cat.title}</h2>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {cat.duas.map(dua => (
                <div key={dua.id} className="bg-card-bg border border-card-border p-5 sm:p-6 md:p-8 rounded-3xl md:rounded-[2rem] shadow-sm">
                  <p className="text-2xl sm:text-3xl md:text-4xl leading-relaxed md:leading-[1.6] font-arabic text-brand-600 dark:text-brand-400 mb-4 md:mb-6 text-right" dir="rtl">
                    {dua.arabic}
                  </p>
                  <p className="text-sm md:text-base text-foreground/80 italic mb-2 md:mb-3">
                    "{dua.transliteration}"
                  </p>
                  <p className="text-sm md:text-base font-medium text-foreground mb-3 md:mb-4 leading-relaxed">
                    {dua.meaning}
                  </p>
                  <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-brand-500 bg-brand-500/10 px-2 md:px-3 py-1 md:py-1.5 rounded">
                    {dua.reference}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
