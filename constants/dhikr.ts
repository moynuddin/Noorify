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
  {
    id: "subhanallah",
    name: "SubhanAllah",
    target: 33,
    arabic: "سُبْحَانَ ٱللَّٰهِ",
    meaning: "Glory be to Allah",
    virtue: "Fills the space between heaven and earth with reward.",
    virtueReference: "Muslim",
  },
  {
    id: "alhamdulillah",
    name: "Alhamdulillah",
    target: 33,
    arabic: "ٱلْحَمْدُ لِلَّٰهِ",
    meaning: "All praise is due to Allah",
    virtue: "Fills the scales (of good deeds).",
    virtueReference: "Muslim",
  },
  {
    id: "allahuakbar",
    name: "Allahu Akbar",
    target: 34,
    arabic: "ٱللَّٰهُ أَكْبَرُ",
    meaning: "Allah is the Greatest",
    virtue:
      "Whoever says it 100 times, none will bring a better deed than him, except one who does more.",
    virtueReference: "Ahmad",
  },
  {
    id: "astaghfirullah",
    name: "Astaghfirullah",
    target: 100,
    arabic: "أَسْتَغْفِرُ ٱللَّٰهَ",
    meaning: "I seek forgiveness from Allah",
    virtue:
      "Allah will provide a way out of every worldly distress and anxiety.",
    virtueReference: "Abu Dawud",
  },
  {
    id: "salawat",
    name: "Salawat",
    target: 100,
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
    meaning: "O Allah, send blessings upon Muhammad",
    virtue:
      "Whoever sends one blessing upon me, Allah will send ten blessings upon him.",
    virtueReference: "Muslim",
  },
];
