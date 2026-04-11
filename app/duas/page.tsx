"use client";

import { motion } from "framer-motion";

const DUAS_CATEGORIES = [
  {
    id: "forgiveness",
    title: "Forgiveness (Istighfar)",
    icon: "🤲",
    duas: [
      {
        id: 1,
        arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
        transliteration: "Allahumma anta rabbee laa ilaaha illa ant, khalaqtanee wa anaa 'abduk, wa anaa 'alaa 'ahdika wa wa'dika masta-ta't, a'oothu bika min sharri maa sana't, aboo'u laka bini'matika 'alayya, wa aboo'u bithanbee faghfir lee, fa'innahoo laa yaghfiruth-thunooba illa ant",
        meaning: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge in You from the evil of which I committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
        reference: "Sahih Al-Bukhari (Sayyid al-Istighfar)"
      }
    ]
  },
  {
    id: "guidance",
    title: "Guidance & Firmness",
    icon: "🧭",
    duas: [
      {
        id: 2,
        arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        transliteration: "Yaa Muqallibal-quloobi thabbit qalbee 'alaa deenik",
        meaning: "O Changer of the hearts, make my heart firm upon Your religion.",
        reference: "Jami\` at-Tirmidhi"
      },
      {
        id: 3,
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ",
        transliteration: "Rabbanaa laa tuzigh quloobanaa ba'da idh hadaytanaa wa hab lanaa min ladunka rahmah, innaka antal-Wahhaab",
        meaning: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
        reference: "Quran 3:8"
      }
    ]
  },
  {
    id: "rizq",
    title: "Rizq (Sustenance)",
    icon: "🌾",
    duas: [
      {
        id: 4,
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
        id: 5,
        arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ",
        transliteration: "Allahumma aafinee fee badanee, allahumma aafinee fee sam'ee, allahumma aafinee fee basaree, laa ilaaha illaa ant",
        meaning: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You.",
        reference: "Abu Dawud"
      },
      {
        id: 6,
        arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shai'un fil-ardi wa la fis-sama'i, wa Huwas-Sami'ul-'Alim",
        meaning: "In the Name of Allah with Whose Name there is protection against every kind of harm in the earth or in the heaven, and He is the All-Hearing and All-Knowing.",
        reference: "Abu Dawud & Tirmidhi"
      }
    ]
  },
  {
    id: "peace",
    title: "Peace & Anxiety",
    icon: "🕊️",
    duas: [
      {
        id: 7,
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-huzni, wal-'ajzi wal-kasali, wal-bukhli wal-jubni, wa dala'id-dayni wa ghalabatir-rijal",
        meaning: "O Allah, I seek refuge in You from grief and sadness, from weakness and from laziness, from miserliness and from cowardice, from being overcome by debt and from oppression of men.",
        reference: "Sahih Al-Bukhari"
      }
    ]
  },
  {
    id: "parents",
    title: "Parents",
    icon: "👨‍👩‍👧‍👦",
    duas: [
      {
        id: 8,
        arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        transliteration: "Rabbir-hamhumaa kamaa rabbayaanee sagheeraa",
        meaning: "My Lord, have mercy upon them [my parents] as they brought me up [when I was] small.",
        reference: "Quran 17:24"
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
