export type PrayerStep = {
  step: number;
  title: string;
  icon: string;
  description: string;
  arabic: string | null;
  transliteration: string | null;
  meaning: string | null;
};

export type PrayerRakah = {
  name: string;
  arabic: string;
  time: string;
  rakahs: number;
  color: string;
};

export type SurahAyah = {
  arabic: string;
  transliteration: string;
  meaning: string;
};

export type CommonSurah = {
  id: number;
  number: string;
  name: string;
  arabic: string;
  meaning: string;
  note: string;
  ayahs: SurahAyah[];
};

export const PRAYER_STEPS: PrayerStep[] = [
  {
    step: 1,
    title: "Make Wudu (Purification)",
    icon: "💧",
    description:
      "Before praying you must be in a state of ritual purity. Perform wudu by washing your hands, mouth, nose, face, arms, wiping your head, washing your ears, and feet — each part three times.",
    arabic: null,
    transliteration: null,
    meaning: null,
  },
  {
    step: 2,
    title: "Intention (Niyyah)",
    icon: "🤍",
    description:
      "Make the intention in your heart to perform the specific prayer (e.g., 'I intend to pray Fajr for the sake of Allah'). The intention is in the heart — it does not have to be said aloud.",
    arabic: null,
    transliteration: null,
    meaning: null,
  },
  {
    step: 3,
    title: "Opening Takbir",
    icon: "🙌",
    description:
      "Stand facing the Qibla (direction of Makkah). Raise both hands to your earlobes and say:",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is the Greatest",
  },
  {
    step: 4,
    title: "Opening Supplication (Optional)",
    icon: "📿",
    description: "Quietly recite the opening dua (Thana):",
    arabic:
      "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
    transliteration:
      "Subhanakal-lahumma wa bihamdik, wa tabaarakasmuk, wa ta'aalaa jadduk, wa laa ilaaha ghayruk",
    meaning:
      "Glory and praise be to You, O Allah. Blessed be Your name and exalted be Your majesty. There is no god but You.",
  },
  {
    step: 5,
    title: "Recite Al-Fatiha",
    icon: "📖",
    description:
      "Recite Surah Al-Fatiha (mandatory in every rakah). Say 'Ameen' quietly at the end.",
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration:
      "Bismillahir-rahmanir-raheem. Alhamdu lillahi rabbil-'aalameen. Ar-rahmanir-raheem. Maaliki yawmid-deen. Iyyaaka na'budu wa iyyaaka nasta'een. Ihdinaas-siraatal-mustaqeem. Siraatal-latheena an'amta 'alayhim, ghayril-maghdoobi 'alayhim wa lad-daaaleen. Ameen.",
    meaning:
      "In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah, Lord of all worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgment. It is You we worship and You we ask for help. Guide us to the straight path — the path of those You have blessed, not of those who have evoked anger or of those who are astray.",
  },
  {
    step: 6,
    title: "Recite Another Surah",
    icon: "📜",
    description:
      "In the first two rakahs, recite any other surah or verses after Al-Fatiha (e.g., Al-Ikhlas, Al-Falaq, An-Nas). See the Common Surahs section below.",
    arabic: null,
    transliteration: null,
    meaning: null,
  },
  {
    step: 7,
    title: "Ruku (Bowing)",
    icon: "🙇",
    description: "Say 'Allahu Akbar', then bow with hands on knees and say:",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: "Subhaana Rabbiyal-'Adheem (×3)",
    meaning: "Glory be to my Lord, the Most Great",
  },
  {
    step: 8,
    title: "Standing from Ruku",
    icon: "🧍",
    description: "Rise while saying:",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ",
    transliteration: "Sami'Allahu liman hamidah. Rabbanaa wa lakal-hamd.",
    meaning:
      "Allah hears those who praise Him. Our Lord, to You is all praise.",
  },
  {
    step: 9,
    title: "First Sujud (Prostration)",
    icon: "🤲",
    description:
      "Say 'Allahu Akbar', then prostrate with forehead, nose, both palms, knees, and toes touching the ground. Say:",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: "Subhaana Rabbiyal-A'laa (×3)",
    meaning: "Glory be to my Lord, the Most High",
  },
  {
    step: 10,
    title: "Sitting Between Sujud",
    icon: "🧎",
    description: "Rise, sit briefly, and say:",
    arabic: "رَبِّ اغْفِرْ لِي",
    transliteration: "Rabbighfir lee",
    meaning: "My Lord, forgive me",
  },
  {
    step: 11,
    title: "Second Sujud",
    icon: "🤲",
    description: "Perform a second prostration identical to the first.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: "Subhaana Rabbiyal-A'laa (×3)",
    meaning: "Glory be to my Lord, the Most High",
  },
  {
    step: 12,
    title: "Tashahhud (At-Tahiyyat)",
    icon: "☝️",
    description:
      "After the last rakah (or 2nd rakah of 3–4 rakah prayers), sit and recite At-Tahiyyat. Raise the right index finger when saying 'illa Allah'.",
    arabic:
      "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration:
      "At-tahiyyaatu lillaahi was-salawaatu wat-tayyibaat. As-salaamu 'alayka ayyuhan-nabiyyu wa rahmatullaahi wa barakaatuh. As-salaamu 'alaynaa wa 'alaa 'ibaadillaahis-saaliheen. Ash-hadu allaa ilaaha illallaah wa ash-hadu anna Muhammadan 'abduhu wa rasooluh.",
    meaning:
      "All greetings, prayers, and goodness belong to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.",
  },
  {
    step: 13,
    title: "Salawat (Durood Ibrahim)",
    icon: "🌟",
    description:
      "After Tashahhud in the final sitting, recite Salawat upon the Prophet ﷺ:",
    arabic:
      "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration:
      "Allahumma salli 'alaa Muhammadin wa 'alaa aali Muhammad, kamaa sallayta 'alaa Ibraaheem wa 'alaa aali Ibraaheem, innaka Hameedun Majeed.",
    meaning:
      "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy and Glorious.",
  },
  {
    step: 14,
    title: "Ending the Prayer (Tasleem)",
    icon: "🕊️",
    description: "Turn your head to the right then the left, saying each time:",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
    transliteration: "As-salaamu 'alaykum wa rahmatullah",
    meaning: "Peace be upon you and the mercy of Allah",
  },
];

export const PRAYER_RAKAHS: PrayerRakah[] = [
  {
    name: "Fajr",
    arabic: "الفجر",
    time: "Dawn",
    rakahs: 2,
    color: "from-amber-400 to-orange-400",
  },
  {
    name: "Dhuhr",
    arabic: "الظهر",
    time: "Midday",
    rakahs: 4,
    color: "from-yellow-400 to-amber-500",
  },
  {
    name: "Asr",
    arabic: "العصر",
    time: "Afternoon",
    rakahs: 4,
    color: "from-orange-400 to-red-400",
  },
  {
    name: "Maghrib",
    arabic: "المغرب",
    time: "Sunset",
    rakahs: 3,
    color: "from-purple-400 to-pink-400",
  },
  {
    name: "Isha",
    arabic: "العشاء",
    time: "Night",
    rakahs: 4,
    color: "from-indigo-400 to-blue-500",
  },
];

export const COMMON_SURAHS: CommonSurah[] = [
  {
    id: 1,
    number: "001",
    name: "Al-Fatiha",
    arabic: "الفاتحة",
    meaning: "The Opening",
    note: "Recited in every rakah — the most important surah to learn first.",
    ayahs: [
      {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillahir-rahmanir-raheem",
        meaning: "In the name of Allah, the Most Gracious, the Most Merciful.",
      },
      {
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Alhamdu lillahi rabbil-'aalameen",
        meaning: "All praise is due to Allah, Lord of all worlds.",
      },
      {
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Ar-rahmanir-raheem",
        meaning: "The Most Gracious, the Most Merciful.",
      },
      {
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: "Maaliki yawmid-deen",
        meaning: "Master of the Day of Judgment.",
      },
      {
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een",
        meaning: "It is You we worship and You we ask for help.",
      },
      {
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdinaas-siraatal-mustaqeem",
        meaning: "Guide us to the straight path.",
      },
      {
        arabic:
          "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration:
          "Siraatal-latheena an'amta 'alayhim, ghayril-maghdoobi 'alayhim wa lad-daaaleen",
        meaning:
          "The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.",
      },
    ],
  },
  {
    id: 2,
    number: "112",
    name: "Al-Ikhlas",
    arabic: "الإخلاص",
    meaning: "Sincerity / Pure Faith",
    note: "Equal to one-third of the Quran in reward. Perfect for prayer.",
    ayahs: [
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: "Qul huwallahu ahad",
        meaning: "Say: He is Allah, the One.",
      },
      {
        arabic: "اللَّهُ الصَّمَدُ",
        transliteration: "Allahus-samad",
        meaning: "Allah, the Eternal Refuge.",
      },
      {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yoolad",
        meaning: "He neither begets nor is born.",
      },
      {
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        transliteration: "Wa lam yakun lahu kufuwan ahad",
        meaning: "Nor is there to Him any equivalent.",
      },
    ],
  },
  {
    id: 3,
    number: "113",
    name: "Al-Falaq",
    arabic: "الفلق",
    meaning: "The Daybreak",
    note: "Recite morning and evening for protection.",
    ayahs: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        transliteration: "Qul a'oodhu bi rabbil-falaq",
        meaning: "Say: I seek refuge in the Lord of daybreak.",
      },
      {
        arabic: "مِن شَرِّ مَا خَلَقَ",
        transliteration: "Min sharri maa khalaq",
        meaning: "From the evil of what He has created.",
      },
      {
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        transliteration: "Wa min sharri ghaasiqin idhaa waqab",
        meaning: "And from the evil of darkness when it settles.",
      },
      {
        arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        transliteration: "Wa min sharrin-naffaathaati fil-'uqad",
        meaning: "And from the evil of the blowers in knots.",
      },
      {
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: "Wa min sharri haasidin idhaa hasad",
        meaning: "And from the evil of an envier when he envies.",
      },
    ],
  },
  {
    id: 4,
    number: "114",
    name: "An-Nas",
    arabic: "الناس",
    meaning: "Mankind",
    note: "Recite with Al-Falaq morning, evening, and before sleep.",
    ayahs: [
      {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Qul a'oodhu bi rabbin-naas",
        meaning: "Say: I seek refuge in the Lord of mankind.",
      },
      {
        arabic: "مَلِكِ النَّاسِ",
        transliteration: "Malikin-naas",
        meaning: "The Sovereign of mankind.",
      },
      {
        arabic: "إِلَٰهِ النَّاسِ",
        transliteration: "Ilaahin-naas",
        meaning: "The God of mankind.",
      },
      {
        arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        transliteration: "Min sharril-waswaasil-khannaas",
        meaning: "From the evil of the retreating whisperer.",
      },
      {
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        transliteration: "Alladhee yuwaswisu fee sudoorin-naas",
        meaning: "Who whispers in the breasts of mankind.",
      },
      {
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration: "Minal-jinnati wan-naas",
        meaning: "From among the jinn and mankind.",
      },
    ],
  },
  {
    id: 5,
    number: "103",
    name: "Al-Asr",
    arabic: "العصر",
    meaning: "The Time",
    note: "Imam Shafi'i said: if only this surah were revealed it would be enough guidance for mankind.",
    ayahs: [
      {
        arabic: "وَالْعَصْرِ",
        transliteration: "Wal-'asr",
        meaning: "By time,",
      },
      {
        arabic: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
        transliteration: "Innal-insaana lafee khusr",
        meaning: "Indeed, mankind is in loss.",
      },
      {
        arabic:
          "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        transliteration:
          "Illal-latheena aamanoo wa 'amiluus-saalihaati wa tawasaw bil-haqqi wa tawasaw bis-sabr",
        meaning:
          "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.",
      },
    ],
  },
  {
    id: 6,
    number: "108",
    name: "Al-Kawthar",
    arabic: "الكوثر",
    meaning: "Abundance",
    note: "The shortest surah in the Quran — easy to memorize.",
    ayahs: [
      {
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        transliteration: "Innaa a'taynakal-kawthar",
        meaning: "Indeed, We have granted you Al-Kawthar (abundance).",
      },
      {
        arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        transliteration: "Fasalli li rabbika wanhar",
        meaning: "So pray to your Lord and sacrifice.",
      },
      {
        arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        transliteration: "Inna shaani'aka huwal-abtar",
        meaning: "Indeed, your enemy is the one cut off.",
      },
    ],
  },
  {
    id: 7,
    number: "002",
    name: "Ayat al-Kursi",
    arabic: "آية الكرسي",
    meaning: "The Throne Verse (2:255)",
    note: "The greatest verse in the Quran. Recite after every obligatory prayer and before sleep.",
    ayahs: [
      {
        arabic:
          "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        transliteration:
          "Allahu laa ilaaha illaa huwal-hayyul-qayyoom, laa ta'khudhuhu sinatun wa laa nawm, lahu maa fis-samaawaati wa maa fil-ard, man dhal-ladhee yashfa'u 'indahu illaa bi'idhnih, ya'lamu maa bayna aydeehim wa maa khalfahum, wa laa yuheetoona bishay'im-min 'ilmihi illaa bimaa shaa', wasi'a kursiyyuhus-samaawaati wal-ard, wa laa ya'ooduhu hifzuhumaa, wa huwal-'aliyyul-'adheem.",
        meaning:
          "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His throne extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
      },
    ],
  },
];
