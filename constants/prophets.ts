// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProphetFamily {
  father: string;
  mother?: string;
  wives?: string[];
  sons?: string[];
  daughters?: string[];
  siblings?: string[];
  notable?: string;
}

export interface Prophet {
  id: string;
  /** English transliterated name */
  name: string;
  /** Arabic script */
  arabicName: string;
  /** Common title or epithet */
  title: string;
  /** Peace-be-upon salutation (short form for display) */
  honorific: "ع" | "ﷺ";
  /** Approximate historical era */
  era: string;
  /** Nation / people they were sent to */
  nation: string;
  family: ProphetFamily;
  /** Number of times the prophet's name appears in the Quran */
  quranicMentions: number;
  /** One-paragraph description */
  description: string;
  /** 3-5 key events / miracles */
  keyEvents: string[];
  // ─── Tree positioning ────────────────────────────────────────────
  /** Part of the direct Adam → Ismail → Muhammad ﷺ main chain */
  mainChain: boolean;
  /** Approximate generation number from Adam (informational) */
  generationLabel?: string;
  /**
   * ID of the prophet this one directly descends from (used to draw the tree).
   * Null for Adam (root) and for prophets whose lineage connection goes through
   * non-prophet ancestors.
   */
  parentId?: string;
  /**
   * If this prophet's lineage branches off the main chain, the ID of the
   * main-chain prophet they branch from.
   */
  branchFromId?: string;
  /** Short note explaining how they connect to the tree */
  lineageNote?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const PROPHETS: Prophet[] = [
  // ── Main Chain ──────────────────────────────────────────────────────────────

  {
    id: "adam",
    name: "Adam",
    arabicName: "آدم",
    title: "Father of Humanity",
    honorific: "ع",
    era: "Beginning of human creation",
    nation: "All of humanity",
    family: {
      father: "Created by Allah from clay",
      mother: "N/A — created directly by Allah",
      wives: ["Hawwa (Eve) — created from Adam's rib"],
      sons: ["Sheeth (Seth)", "Habil (Abel)", "Qabil (Cain)"],
      daughters: ["Several daughters (unnamed in scripture)"],
    },
    quranicMentions: 25,
    description:
      "Adam عليه السلام is the first human being and the first prophet. Allah created him from clay with His own hands, breathed life into him, and commanded the angels to prostrate before him. He and his wife Hawwa (Eve) were placed in Paradise and later sent to earth after eating from the forbidden tree. He was taught the names of all things, making him the father of human knowledge as well as human lineage.",
    keyEvents: [
      "Created by Allah from clay; Allah breathed life into him directly",
      "Angels prostrated before him; Iblis (Shaytan) refused out of arrogance",
      "Placed in Paradise with Hawwa; later descended to earth",
      "Received the first revelation and prophethood on earth",
      "Repented and was forgiven by Allah — the first act of tawbah",
    ],
    mainChain: true,
    generationLabel: "1st generation",
    lineageNote: "Root of all humanity and the prophetic chain",
  },

  {
    id: "idris",
    name: "Idris",
    arabicName: "إدريس",
    title: "The Truthful & Patient (As-Siddiq)",
    honorific: "ع",
    era: "Pre-Flood era (~5th–6th generation from Adam)",
    nation: "People of Babylon (ancient Mesopotamia)",
    family: {
      father: "Yarid (Jared) — descendant of Sheeth (Seth) ibn Adam",
      mother: "Baraka (name varies in scholarly sources)",
      sons: ["Mattushalakh (Methuselah) — grandfather of Nuh"],
    },
    quranicMentions: 2,
    description:
      "Idris عليه السلام is mentioned in the Quran as a truthful prophet and a man of high station. He is widely identified with Enoch in other traditions. He was gifted with wisdom, and was the first to write with a pen and study the stars. Allah raised him to a lofty place, and some scholars interpret this as him being raised alive to the heavens — an honour shared with Isa عليه السلام.",
    keyEvents: [
      "First person to write with a pen and record knowledge",
      "Taught astronomy, mathematics, and craftsmanship to his people",
      "Raised to a 'lofty place' by Allah — interpreted as the heavens",
      "Met by the Prophet Muhammad ﷺ in the second or fourth heaven during Al-Mi'raj",
    ],
    mainChain: true,
    generationLabel: "~5th–6th from Adam",
    parentId: "adam",
    lineageNote: "Descended from Sheeth (Seth), son of Adam",
  },

  {
    id: "nuh",
    name: "Nuh",
    arabicName: "نوح",
    title: "The Grateful Servant (ʿAbdun Shakūr)",
    honorific: "ع",
    era: "Pre-Flood era (~10th generation from Adam)",
    nation: "Ancient people of the pre-Flood world",
    family: {
      father: "Lamk (Lamech) — descendant of Idris عليه السلام",
      mother: "Shamkha bint Anush (varies in sources)",
      wives: ["Wahila (disbeliever who perished in the Flood)"],
      sons: [
        "Sam (Shem) — ancestor of Arabs, Persians & Hebrews",
        "Ham — ancestor of Africans and some Eastern peoples",
        "Yafith (Japheth) — ancestor of European and Central Asian peoples",
        "Kan'an — drowned in the Flood for disbelief",
      ],
    },
    quranicMentions: 43,
    description:
      "Nuh عليه السلام is one of the five greatest prophets (Ulul-'Azm). He preached to his people for 950 years — the longest single mission of any prophet. When they persisted in disbelief, Allah commanded him to build the Ark. He carried believers and pairs of every animal aboard while the great Flood destroyed the rest. After the Flood receded, he and the survivors settled the earth anew, making him the second father of humanity.",
    keyEvents: [
      "Preached to his people for 950 years with very few converts",
      "Built the great Ark (Safinat Nuh) under divine instruction",
      "The Great Flood destroyed all disbelievers including his son Kan'an",
      "Ark settled on Mount Judi (Al-Judi) after the Flood",
      "His three sons Shem, Ham, and Japheth repopulated the earth",
    ],
    mainChain: true,
    generationLabel: "~10th from Adam",
    parentId: "idris",
    lineageNote: "Descended from Idris through Lamech",
  },

  {
    id: "ibrahim",
    name: "Ibrahim",
    arabicName: "إبراهيم",
    title: "Friend of Allah (Khalīlullāh) · Father of Prophets",
    honorific: "ع",
    era: "~2000 BCE, Mesopotamia and Canaan",
    nation: "People of Ur (Iraq), then Canaan and Arabia",
    family: {
      father: "Azar (Terah) — idol-maker of Ur, descended from Sam ibn Nuh",
      mother: "Nuna / Amathlaa (names vary in scholarly sources)",
      wives: [
        "Sarah (Sāra) — mother of Ishaq",
        "Hajar (Hagar) — mother of Ismail, given to Ibrahim by Pharaoh",
      ],
      sons: [
        "Ismail عليه السلام (by Hajar) — first-born, ancestor of Arabs & Muhammad ﷺ",
        "Ishaq عليه السلام (by Sarah) — ancestor of Banu Israil",
        "Six more sons by his third wife Qatura (Keturah), including Madyan",
      ],
      siblings: ["Nahor", "Haran (father of Lut عليه السلام)"],
      notable:
        "Nephew: Lut عليه السلام (son of his brother Haran). Grandson: Yaqub عليه السلام.",
    },
    quranicMentions: 69,
    description:
      "Ibrahim عليه السلام is the patriarch of the Abrahamic prophets — the ancestor of Ismail, Ishaq, Yaqub, Yusuf, Musa, Dawud, Sulayman, Isa, and Muhammad ﷺ. He smashed the idols of his people, was cast into the fire by Nimrod (which Allah made cool and safe), migrated to Canaan, settled Hajar and Ismail in the barren valley of Makkah, and built the Ka'bah with Ismail. He passed the ultimate test of sacrificing his son — an act commemorated every year on Eid al-Adha.",
    keyEvents: [
      "Smashed his people's idols and debated Nimrod on the existence of Allah",
      "Cast into a great fire by Nimrod — Allah commanded it to be 'cool and safe'",
      "Left Hajar and infant Ismail in Makkah; the Zamzam spring miraculously appeared",
      "Commanded to sacrifice his son; a ram was substituted — origin of Eid al-Adha",
      "Built the Ka'bah with Ismail عليه السلام and made the first call to Hajj",
    ],
    mainChain: true,
    generationLabel: "~descended from Shem ibn Nuh",
    parentId: "nuh",
    lineageNote:
      "From Shem (Sam) ibn Nuh through Arphaxad → Shelah → Eber → Peleg → Reu → Serug → Nahor → Azar (Terah)",
  },

  {
    id: "ismail",
    name: "Ismail",
    arabicName: "إسماعيل",
    title: "The Patient · Master of Promise (Sādiq al-Waʿd)",
    honorific: "ع",
    era: "~1900–1800 BCE, Arabia (Hijaz)",
    nation: "Arab tribes of the Hijaz",
    family: {
      father: "Ibrahim عليه السلام",
      mother: "Hajar (Hagar) — an Egyptian noblewoman",
      wives: [
        "First wife (from Jurhum tribe, divorced by Ibrahim's advice)",
        "Sayyida bint Mudad al-Jurhumi — second wife (praised by Ibrahim)",
      ],
      sons: [
        "12 sons (ancestral tribes of northern Arabia)",
        "Qaydar (Kedar) — most notable; direct ancestor of Muhammad ﷺ",
        "Nabajot (Nebaioth) — first-born son",
      ],
    },
    quranicMentions: 12,
    description:
      "Ismail عليه السلام is the elder son of Ibrahim, born of Hajar. As an infant in the barren valley of Makkah, he and his mother were sustained by the miracle of Zamzam. He helped his father build the Ka'bah, the House of Allah. He is the ancestor of the Adnanite Arabs and — through the line of Qaydar — of the Prophet Muhammad ﷺ. He is praised in the Quran as truthful in his promise and one who used to enjoin upon his family prayer and almsgiving.",
    keyEvents: [
      "Left as an infant in Makkah; the Zamzam spring burst from beneath his feet",
      "Grew up among the Jurhum Arab tribe and mastered the Arabic language",
      "Submitted willingly to be sacrificed by his father Ibrahim — ransomed by a ram",
      "Built the Ka'bah together with his father Ibrahim عليه السلام",
      "Direct ancestor of the Prophet Muhammad ﷺ through the line of Qaydar",
    ],
    mainChain: true,
    generationLabel: "Son of Ibrahim",
    parentId: "ibrahim",
    lineageNote:
      "Main chain continues through Ismail → Qaydar → ... → Muhammad ﷺ",
  },

  {
    id: "muhammad",
    name: "Muhammad",
    arabicName: "مُحَمَّد",
    title: "Seal of the Prophets (Khātam al-Nabiyyīn) · Beloved of Allah",
    honorific: "ﷺ",
    era: "570–632 CE, Makkah and Madinah, Arabia",
    nation: "All of humanity (Rahmatan lil-'Alamin)",
    family: {
      father: "Abdullah ibn Abd al-Muttalib (died before Muhammad's birth)",
      mother: "Aminah bint Wahb (died when Muhammad ﷺ was ~6 years old)",
      wives: [
        "Khadijah bint Khuwaylid ع (first wife, 25 years of marriage)",
        "Sawdah bint Zamʿah",
        "Aisha bint Abi Bakr ع",
        "Hafsa bint Umar ع",
        "Zaynab bint Khuzaymah",
        "Umm Salamah (Hind bint Abi Umayyah)",
        "Zaynab bint Jahsh",
        "Juwayriyyah bint al-Harith",
        "Umm Habibah (Ramlah bint Abi Sufyan)",
        "Safiyyah bint Huyayy",
        "Maymunah bint al-Harith",
      ],
      sons: [
        "Al-Qasim (died in infancy — by Khadijah)",
        "Abdullah / At-Tahir (died in infancy — by Khadijah)",
        "Ibrahim (died at ~18 months — by Mariyah al-Qibtiyyah)",
      ],
      daughters: [
        "Zaynab bint Muhammad",
        "Ruqayyah bint Muhammad",
        "Umm Kulthum bint Muhammad",
        "Fatimah al-Zahra ع (mother of Hasan and Husayn ع)",
      ],
      notable:
        "Grandfather: Abd al-Muttalib. Uncle & protector: Abu Talib. Cousin & son-in-law: Ali ibn Abi Talib. Lineage: Muhammad ﷺ → Abdullah → Abd al-Muttalib → Hashim → Abd Manaf → Qusayy → Kilab → Murrah → Ka'b → Lu'ayy → Ghalib → Fihr (Quraysh) → ... → Qaydar → Ismail ع",
    },
    quranicMentions: 4,
    description:
      "Muhammad ﷺ is the final and seal of all prophets, sent as a mercy to all worlds (Quran 21:107). Born in Makkah in 570 CE into the noble Quraysh tribe, he received the first revelation at age 40 in the Cave of Hira. Over 23 years he conveyed the complete and final message of Islam, united the Arabian Peninsula, and established a civilization. The Quran was revealed to him and preserved perfectly to this day.",
    keyEvents: [
      "First revelation received in Cave of Hira: 'Iqra!' (Read!) — Surah Al-'Alaq",
      "Al-Isra wal-Mi'raj: night journey from Makkah to Jerusalem then ascent through the heavens",
      "Hijrah (migration) from Makkah to Madinah — marks the start of the Islamic calendar",
      "Conquest of Makkah (Fath Makkah) — forgave all enemies with no bloodshed",
      "Farewell Sermon (Khutbat al-Wada) — final comprehensive message to humanity",
    ],
    mainChain: true,
    generationLabel: "Final Prophet (~57th from Adam)",
    parentId: "ismail",
    lineageNote:
      "From Ismail → Qaydar → Adnan → ... → Hashim → Abd al-Muttalib → Abdullah → Muhammad ﷺ",
  },

  // ── Branch: From Nuh's descendants (Arab / pre-Abrahamic prophets) ──────────

  {
    id: "hud",
    name: "Hud",
    arabicName: "هُود",
    title: "Brother of Aad (Akh 'Ād)",
    honorific: "ع",
    era: "After the Flood, several generations after Nuh (~2500–2000 BCE)",
    nation: "Aad — an ancient Arab tribe in southern Arabia (Ahqaf desert)",
    family: {
      father: "Abdullah ibn Rabah ibn al-Khulud (from Shem ibn Nuh's lineage)",
    },
    quranicMentions: 7,
    description:
      "Hud عليه السلام was sent to the ancient tribe of Aad who lived in the region of Al-Ahqaf (southern Arabian Peninsula, perhaps modern Yemen/Oman). They were a powerful people blessed with great stature and fertile lands, yet they worshipped idols. Hud called them to Allah alone, but they refused and mocked him. Allah destroyed them with a violent, howling wind that raged for seven nights and eight days.",
    keyEvents: [
      "Called the powerful tribe of Aad to worship Allah alone",
      "Warned them of punishment for their pride and idol worship",
      "Aad was destroyed by a roaring wind for 7 nights and 8 days",
      "Hud and the believers were saved from the destruction",
    ],
    mainChain: false,
    branchFromId: "nuh",
    lineageNote: "Descended from Shem (Sam) ibn Nuh — sent to the tribe of Aad",
  },

  {
    id: "salih",
    name: "Salih",
    arabicName: "صَالِح",
    title: "Prophet of Thamud",
    honorific: "ع",
    era: "After Hud (~2000–1500 BCE)",
    nation:
      "Thamud — ancient Arab tribe in Al-Hijr (northwestern Arabia, modern Al-'Ula)",
    family: {
      father:
        "Ubaid ibn Asif ibn Mashikh ibn Ubaid (from Shem ibn Nuh's lineage)",
    },
    quranicMentions: 9,
    description:
      "Salih عليه السلام was sent to the tribe of Thamud who carved magnificent dwellings from the mountains of Al-Hijr (Madain Salih). They too fell into idol worship. Allah gave them a miraculous sign: a she-camel (Naqat Allah) that appeared from the rock. Salih warned them not to harm her. They hamstrung and killed her, so Allah destroyed them with a mighty blast (As-Sayhah) three days after the deed.",
    keyEvents: [
      "Gave the tribe of Thamud the miraculous she-camel as a sign from Allah",
      "Warned: 'Do not harm the camel or a painful punishment will seize you'",
      "Thamud hamstrung the she-camel — the most rebellious among them led this act",
      "Three days later, a thunderous blast destroyed all of Thamud",
      "Salih and the believers were saved; the ruins remain at Madain Salih today",
    ],
    mainChain: false,
    branchFromId: "nuh",
    lineageNote: "Descended from Shem ibn Nuh — sent to the tribe of Thamud",
  },

  // ── Branch: From Ibrahim directly ───────────────────────────────────────────

  {
    id: "lut",
    name: "Lut",
    arabicName: "لُوط",
    title: "Prophet of Sodom",
    honorific: "ع",
    era: "Contemporary of Ibrahim عليه السلام (~2000 BCE)",
    nation: "Sodom & Gomorrah (Qawm Lut) — in the Jordan Valley",
    family: {
      father: "Haran ibn Azar — Ibrahim's brother",
      mother: "Unnamed in scripture",
      wives: [
        "Wife who betrayed him (a disbeliever who perished with the city)",
      ],
      daughters: ["Two daughters (saved with Lut)"],
      notable: "Nephew of Ibrahim عليه السلام",
    },
    quranicMentions: 27,
    description:
      "Lut عليه السلام is the nephew of Ibrahim. He migrated with his uncle and was then sent to the people of Sodom who were notorious for their grave moral transgressions — particularly the sin that bears his name (homosexual acts were their widespread practice). Angels came to Lut in the form of handsome young men; the people of Sodom rushed to assault them. Allah commanded Lut to leave at night with his family, then rained down a devastating punishment on the city.",
    keyEvents: [
      "Nephew of Ibrahim — travelled with him from Ur",
      "Sent to the people of Sodom and Gomorrah to call them to righteousness",
      "Angels disguised as handsome men visited Lut; townspeople tried to assault them",
      "Commanded to leave the city at night with his family (excluding his wife)",
      "Cities overturned and rained upon with stones of baked clay — total destruction",
    ],
    mainChain: false,
    branchFromId: "ibrahim",
    lineageNote:
      "Nephew of Ibrahim عليه السلام (son of Ibrahim's brother Haran)",
  },

  {
    id: "shuayb",
    name: "Shuayb",
    arabicName: "شُعَيْب",
    title: "Orator of the Prophets (Khatib al-Anbiya')",
    honorific: "ع",
    era: "~1500–1300 BCE, before or contemporary with Musa",
    nation: "Midian (Madyan) and the People of Al-Aykah",
    family: {
      father:
        "Mikayil ibn Yashjun (from Midian, some say descendant of Ibrahim's son Madyan)",
      daughters: [
        "Elder daughter — married Musa عليه السلام",
        "Younger daughter",
      ],
      notable: "Father-in-law of Musa عليه السلام",
    },
    quranicMentions: 11,
    description:
      "Shuayb عليه السلام was the eloquent prophet sent to the people of Midian (Madyan) and the people of Al-Aykah — two communities notorious for cheating in weights and measures and for highway robbery. He called them to justice in commerce and to worship Allah alone. His pleas were rejected, and both nations were destroyed — Midian by the Cry (As-Sayhah) and Al-Aykah by the torment of a scorching Day (Yawm al-Zullah).",
    keyEvents: [
      "Called Midian to honest trade — 'Give full measure and weight and do not defraud people'",
      "Father-in-law of Musa عليه السلام; Musa worked for him for 8–10 years",
      "Argued eloquently with his people who mocked his prayer",
      "Midian destroyed by a roaring blast; People of Al-Aykah by the scorching Day",
    ],
    mainChain: false,
    branchFromId: "ibrahim",
    lineageNote:
      "From Midian (son of Ibrahim by Qatura) — sent to the people of Midian",
  },

  // ── Branch: Banu Israil (from Ishaq → Yaqub) ────────────────────────────────

  {
    id: "ishaq",
    name: "Ishaq",
    arabicName: "إِسْحَاق",
    title: "The Blessed Prophet",
    honorific: "ع",
    era: "~1900–1800 BCE, Canaan",
    nation: "Canaan (present-day Palestine/Israel region)",
    family: {
      father: "Ibrahim عليه السلام",
      mother: "Sarah — Ibrahim's first wife",
      wives: ["Rifqah (Rebecca) — from the family of Nahor"],
      sons: [
        "Yaqub (Jacob/Israel) عليه السلام — younger twin",
        "Esau (Al-'Ays) — elder twin, ancestor of some Arab and Edomite peoples",
      ],
      notable: "Brother: Ismail عليه السلام",
    },
    quranicMentions: 17,
    description:
      "Ishaq عليه السلام is the second son of Ibrahim, miraculously born to his aged wife Sarah. The angels announced his birth when they visited Ibrahim and Lut. He is the patriarch of the Banu Israil (Children of Israel) — his son Yaqub (given the title 'Israel') fathered twelve sons who became the Twelve Tribes. The chain of Banu Israil prophets — Yusuf, Musa, Harun, Dawud, Sulayman, Zakariyya, Yahya, and Isa — all trace back to Ishaq.",
    keyEvents: [
      "Birth announced by angels to aged Sarah — a miraculous gift from Allah",
      "Given prophethood and continued the mission of his father Ibrahim",
      "His son Yaqub received the title 'Israel' (Servant of Allah)",
      "Patriarch of the Banu Israil and all the Israelite prophets",
    ],
    mainChain: false,
    branchFromId: "ibrahim",
    lineageNote: "Son of Ibrahim and Sarah — patriarch of Banu Israil",
  },

  {
    id: "yaqub",
    name: "Yaqub",
    arabicName: "يَعْقُوب",
    title: "Israel (إِسْرَائِيل — Servant of Allah)",
    honorific: "ع",
    era: "~1800–1700 BCE, Canaan and Egypt",
    nation: "Canaan",
    family: {
      father: "Ishaq عليه السلام",
      mother: "Rifqah (Rebecca)",
      wives: [
        "Liya (Leah) — mother of Ruben, Simeon, Levi, Judah, Issachar, Zebulun",
        "Rahil (Rachel) — mother of Yusuf عليه السلام and Benjamin",
        "Bilhah — mother of Dan and Naphtali",
        "Zilpah — mother of Gad and Asher",
      ],
      sons: [
        "Ruben (Rubil)",
        "Simeon (Sham'un)",
        "Levi (Lawi) — ancestor of Musa عليه السلام",
        "Judah (Yahuda) — ancestor of Dawud عليه السلام and Isa عليه السلام",
        "Issachar (Yasakhar)",
        "Zebulun (Zabulun)",
        "Dan",
        "Naphtali (Naftali)",
        "Gad",
        "Asher (Ashir)",
        "Yusuf عليه السلام",
        "Benjamin (Bunyamin)",
      ],
      notable: "Twin brother: Esau (Al-'Ays)",
    },
    quranicMentions: 16,
    description:
      "Yaqub عليه السلام — given the divine title 'Israel' (Servant of Allah) — is the son of Ishaq and the father of the Twelve Tribes of Israel. He endured decades of grief over his beloved son Yusuf, whom his other sons had thrown into a well out of jealousy. Eventually, a glorious reunion took place in Egypt when Yusuf became a high official. Yaqub's twelve sons and their descendants became the nation of Banu Israil.",
    keyEvents: [
      "Received the title 'Israel' from Allah — meaning Servant or Chosen of Allah",
      "His twelve sons formed the Twelve Tribes of Banu Israil",
      "Grieved deeply for Yusuf after his sons deceived him; wept until he lost his sight",
      "Miraculously regained his sight when Yusuf's shirt was placed over his eyes",
      "Reunited with Yusuf in Egypt after decades of separation",
    ],
    mainChain: false,
    branchFromId: "ishaq",
    parentId: "ishaq",
    lineageNote: "Son of Ishaq — patriarch of the 12 tribes of Banu Israil",
  },

  {
    id: "yusuf",
    name: "Yusuf",
    arabicName: "يُوسُف",
    title: "The Truthful (As-Siddīq)",
    honorific: "ع",
    era: "~1700–1600 BCE, Canaan and Egypt",
    nation: "Egypt (Misr)",
    family: {
      father: "Yaqub (Israel) عليه السلام",
      mother: "Rahil (Rachel) — died giving birth to Benjamin",
      siblings: ["11 brothers — the sons of Yaqub"],
      wives: [
        "Zulaykha (according to some scholars, married her after becoming minister)",
      ],
      sons: ["Afraim (Ephraim)", "Mansha (Manasseh)"],
      notable: "Full brother: Benjamin (Bunyamin)",
    },
    quranicMentions: 27,
    description:
      "Yusuf عليه السلام is dedicated an entire surah in the Quran — Surah Yusuf — described as 'the best of stories'. His brothers, jealous of their father's love for him, threw him into a well. He was sold into slavery in Egypt, faced false accusations from the wife of the minister (Zulaykha) and was imprisoned, yet remained patient and upright. He was gifted with the interpretation of dreams, rose to become the finance minister of Egypt, and ultimately forgave his brothers in a deeply moving reunion.",
    keyEvents: [
      "His brothers threw him into a well out of jealousy; sold as a slave in Egypt",
      "Resisted the seduction of the minister's wife and was imprisoned unjustly",
      "Interpreted the king's dream of 7 fat and 7 lean cows — predicting famine",
      "Became the Finance Minister of Egypt; managed 7 years of plenty and 7 of famine",
      "Forgave his brothers and reunited with his father Yaqub in Egypt",
    ],
    mainChain: false,
    branchFromId: "yaqub",
    parentId: "yaqub",
    lineageNote: "Son of Yaqub — his story is the entire Surah Yusuf",
  },

  {
    id: "ayyub",
    name: "Ayyub",
    arabicName: "أَيُّوب",
    title: "The Patient (As-Sābir)",
    honorific: "ع",
    era: "~1500–1300 BCE",
    nation: "Land of Uz (Syria/Jordan region)",
    family: {
      father: "Amos ibn Razih ibn Esau (Al-'Ays) ibn Ishaq عليه السلام",
      wives: [
        "Rahma (also called Liya or Liyyā) — remained loyally by his side through 18 years of affliction",
      ],
      sons: [
        "Bishr (some scholars identify him as Dhul-Kifl عليه السلام)",
        "Other sons restored after his trial",
      ],
      notable:
        "Descended from Esau, son of Ishaq — thus a cousin-lineage of Yaqub",
    },
    quranicMentions: 4,
    description:
      "Ayyub عليه السلام is the supreme example of patience (sabr) in the Quran. Satan challenged that Ayyub was only pious because he was blessed. Allah permitted a trial: Ayyub lost his wealth, his children, and was afflicted with severe illness for 18 years. Yet he never complained against Allah. Finally he called out, 'Harm has afflicted me, but You are the Most Merciful.' Allah instantly cured him, restored his family and doubled his blessings.",
    keyEvents: [
      "Endured severe illness and loss for approximately 18 years with perfect patience",
      "Made dua: 'Harm has afflicted me and You are the Most Merciful of the merciful'",
      "Commanded to strike the ground — a spring appeared and cured his illness",
      "Allah restored his family and doubled his blessings as a reward for his patience",
      "His example is cited in the Quran as the ultimate model of gratitude in hardship",
    ],
    mainChain: false,
    branchFromId: "ishaq",
    lineageNote: "From Esau, son of Ishaq — cousin lineage to Banu Israil",
  },

  {
    id: "dhul-kifl",
    name: "Dhul-Kifl",
    arabicName: "ذُو الْكِفْل",
    title: "The One of the Double Reward / The Pledge",
    honorific: "ع",
    era: "~1400–1200 BCE",
    nation: "Syria/Jordan area (some say sent to a remnant of Banu Israil)",
    family: {
      father: "Some scholars say he is Bishr, son of Ayyub عليه السلام",
      notable: "Possibly identified with Ezekiel in other traditions",
    },
    quranicMentions: 2,
    description:
      "Dhul-Kifl عليه السلام is mentioned twice in the Quran alongside Ismail and Idris as someone who was 'of the patient'. His name means 'one of the double reward' or 'one of the pledge/portion'. Classical Islamic scholars have varied opinions on his identity — some say he was a prophet, others a righteous man. The most common view is that he was a son of Ayyub عليه السلام. He is praised for his patience and uprightness.",
    keyEvents: [
      "Mentioned in the Quran alongside great prophets as one 'of the patient'",
      "Some scholars say he pledged to pray all night, fast all day, and judge justly",
      "Possibly tested by Shaytan who tried to break his pledged acts of worship",
      "His patience and fulfilment of his pledge earned him the title Dhul-Kifl",
    ],
    mainChain: false,
    branchFromId: "ayyub",
    lineageNote: "Possibly son of Ayyub عليه السلام",
  },

  {
    id: "musa",
    name: "Musa",
    arabicName: "مُوسَى",
    title: "One Who Spoke to Allah (Kalīmullāh)",
    honorific: "ع",
    era: "~1300 BCE, Egypt and Sinai",
    nation: "Banu Israil — delivered from Pharaoh (Firʿawn) of Egypt",
    family: {
      father: "Imran (descended from Levi ibn Yaqub عليه السلام)",
      mother:
        "Yukabad (Jochebed) — received divine inspiration to place him in the river",
      siblings: [
        "Harun عليه السلام — elder brother and co-prophet",
        "Maryam bint Imran — elder sister (not the mother of Isa; different person)",
      ],
      wives: ["Safura (Zipporah) — daughter of Shuayb عليه السلام"],
      sons: ["Gershom", "Eliezer (in some scholarly accounts)"],
      notable:
        "Raised in the palace of Pharaoh as an adopted son of Asiyah (Pharaoh's wife)",
    },
    quranicMentions: 136,
    description:
      "Musa عليه السلام is the most mentioned prophet in the Quran. Born when Pharaoh was massacring infant Israelite boys, he was placed in a basket in the Nile and miraculously raised in Pharaoh's own palace. He fled to Midian after killing an Egyptian man, worked for Shuayb for 10 years, and received prophethood at the Burning Bush (Mount Sinai). He confronted Pharaoh with 9 miracles, led the Exodus of Banu Israil across the Red Sea, received the Torah on Mount Sinai, and spoke directly with Allah.",
    keyEvents: [
      "Placed as an infant in the Nile — raised in Pharaoh's palace by Asiyah",
      "Spoke to Allah at the Burning Bush (At-Tur) — received the staff and white hand miracles",
      "Confronted Pharaoh with 9 miraculous signs; defeated his sorcerers publicly",
      "Led the Exodus: split the Red Sea — Pharaoh drowned pursuing them",
      "Received the Torah (Tawrah) on Mount Sinai after 40 nights with Allah",
    ],
    mainChain: false,
    branchFromId: "yaqub",
    lineageNote: "From Levi ibn Yaqub → Kohath → Imran → Musa ع",
  },

  {
    id: "harun",
    name: "Harun",
    arabicName: "هَارُون",
    title: "The Eloquent Helper",
    honorific: "ع",
    era: "~1300 BCE, Egypt and Sinai",
    nation: "Banu Israil",
    family: {
      father: "Imran (from Levi ibn Yaqub عليه السلام)",
      mother: "Yukabad (Jochebed)",
      siblings: [
        "Musa عليه السلام — younger brother and chief prophet",
        "Maryam bint Imran — sister",
      ],
      wives: ["Elisheba bint Amminadab"],
      sons: ["Nadab", "Abihu", "Eleazar", "Ithamar"],
      notable: "The priestly lineage (Aal Harun) descends from him",
    },
    quranicMentions: 20,
    description:
      "Harun عليه السلام is the elder brother of Musa, gifted with eloquence. When Musa asked Allah for a companion in his mission to Pharaoh, Allah appointed Harun as his helper and co-prophet. He was left in charge of Banu Israil when Musa went to receive the Torah for 40 days. During that time the Israelites fell into worshipping the Golden Calf — an act Harun opposed but could not stop. He is praised in the Quran alongside Musa as a righteous servant.",
    keyEvents: [
      "Appointed as co-prophet and spokesman for Musa before Pharaoh",
      "Left in charge of Banu Israil during Musa's 40 nights on Mount Sinai",
      "Opposed the Golden Calf worship but was physically overpowered by the rebellious Israelites",
      "Vindicated before Musa after the crisis of the Golden Calf",
      "His descendants (the priestly Levites) served in the Tabernacle and Temple",
    ],
    mainChain: false,
    branchFromId: "yaqub",
    parentId: "musa",
    lineageNote: "Elder brother of Musa ع — both from Levi ibn Yaqub",
  },

  {
    id: "dawud",
    name: "Dawud",
    arabicName: "دَاوُود",
    title: "Vicegerent of Allah on Earth (Khalīfatullāh)",
    honorific: "ع",
    era: "~1000 BCE, Kingdom of Israel (Canaan)",
    nation: "Banu Israil — became their king",
    family: {
      father:
        "Isa ibn Uwayd (Jesse) — from the tribe of Judah (Yahuda) ibn Yaqub",
      wives: [
        "Mikhal (daughter of Saul/Talut)",
        "Abigail",
        "Bathsheba (Basheba) — mother of Sulayman",
        "and others",
      ],
      sons: [
        "Sulayman عليه السلام (by Bathsheba) — inherited his kingdom and prophethood",
        "Absalom",
        "Adonijah",
        "and many others",
      ],
      notable: "Given the Zabur (Psalms) by Allah",
    },
    quranicMentions: 16,
    description:
      "Dawud عليه السلام is both a prophet and a king. As a young shepherd, he slew the giant Goliath (Jalut) with a sling, turning the tide of battle for the Israelites. Allah gave him the Zabur (Psalms), made iron soft in his hands, taught him the language of birds, and gifted him with a melodious voice that caused all creation to join in his glorification of Allah. He was given the combined offices of prophethood and kingship — a rare honour.",
    keyEvents: [
      "As a youth, slew the giant Goliath (Jalut) with a single stone from a sling",
      "Became king over Banu Israil — united prophet and ruler",
      "Received the Zabur (Psalms) — the scripture of Dawud",
      "Iron was made soft for him — he crafted chainmail armour",
      "Birds and mountains joined him in glorifying (tasbih of) Allah",
    ],
    mainChain: false,
    branchFromId: "yaqub",
    lineageNote: "From Judah (Yahuda) ibn Yaqub — tribe of Judah",
  },

  {
    id: "sulayman",
    name: "Sulayman",
    arabicName: "سُلَيْمَان",
    title: "King of Prophets",
    honorific: "ع",
    era: "~970–930 BCE, Kingdom of Israel",
    nation: "Banu Israil — ruled the greatest kingdom of his time",
    family: {
      father: "Dawud عليه السلام",
      mother: "Bathsheba (Basheba)",
      wives: [
        "Hundreds of wives (the Quran does not specify names)",
        "The Queen of Sheba (Bilqis) in some scholarly traditions",
      ],
      sons: ["Rehoboam (Rubu'am) — succeeded him as king"],
    },
    quranicMentions: 17,
    description:
      "Sulayman عليه السلام inherited his father Dawud's kingdom and prophethood. Allah granted him an extraordinary dominion: control over the wind (which carried his throne long distances), command over the jinn (who built magnificent structures for him), knowledge of the language of birds and animals, and the ability to understand the speech of ants. The Queen of Sheba (Bilqis) visited him after his hoopoe bird brought him news of her kingdom, and she embraced Islam.",
    keyEvents: [
      "Understood the language of birds, animals, and ants",
      "Commanded jinn and wind; they built the Temple of Jerusalem for him",
      "His hoopoe bird brought him news of the Queen of Sheba (Bilqis)",
      "The Queen of Sheba's throne was transported to him in the blink of an eye",
      "Bilqis and her people embraced Islam after witnessing his wisdom and miracles",
    ],
    mainChain: false,
    branchFromId: "dawud",
    parentId: "dawud",
    lineageNote: "Son of Dawud ع — inherited kingship and prophethood",
  },

  {
    id: "ilyas",
    name: "Ilyas",
    arabicName: "إِلْيَاس",
    title: "The Steadfast (Elijah)",
    honorific: "ع",
    era: "~900 BCE, northern Kingdom of Israel",
    nation: "Banu Israil (northern Kingdom of Israel — 10 tribes)",
    family: {
      father: "Yasin (some say from the lineage of Harun عليه السلام)",
      notable: "Al-Yasa (Elisha) عليه السلام was his student and successor",
    },
    quranicMentions: 2,
    description:
      "Ilyas عليه السلام was sent to the northern Kingdom of Israel when they had fallen into worshipping the idol Baal (Ba'l). He boldly challenged the priests of Baal and called the people back to Allah. The Quran praises him and his followers, saying peace be upon him among all the worlds (37:130). He is associated with miraculous power and some scholars say he was raised alive like Idris عليه السلام.",
    keyEvents: [
      "Sent to Banu Israil who were worshipping the idol Baal (Ba'l)",
      "Challenged the 450 priests of Baal and proved the truth of Allah",
      "Called his people to abandon idol worship and return to the covenant of Ibrahim",
      "Allah's salam (peace) is pronounced upon him specifically in the Quran (37:130)",
    ],
    mainChain: false,
    branchFromId: "harun",
    lineageNote:
      "From the lineage of Harun ع — sent to the northern Kingdom of Israel",
  },

  {
    id: "al-yasa",
    name: "Al-Yasa",
    arabicName: "الْيَسَع",
    title: "The Inheritor of Ilyas (Elisha)",
    honorific: "ع",
    era: "~850 BCE, northern Kingdom of Israel",
    nation: "Banu Israil (successor mission after Ilyas)",
    family: {
      father: "Akhub ibn Adiy (Shaphat in Hebrew tradition)",
      notable: "Student and appointed successor of Ilyas عليه السلام",
    },
    quranicMentions: 2,
    description:
      "Al-Yasa عليه السلام is the student and divinely-appointed successor of Ilyas. He continued the prophetic mission among Banu Israil after Ilyas. He is listed in the Quran among the prophets whom Allah chose and exalted above the worlds. He is identified with Elisha in the Hebrew and Christian traditions. The Quran mentions him twice, grouping him with the great prophets as one who was preferred over all nations of his time.",
    keyEvents: [
      "Appointed by Allah as prophet and successor to Ilyas عليه السلام",
      "Continued the mission of calling Banu Israil back to Allah",
      "Mentioned in the Quran as being preferred over the nations (6:86)",
      "Associated with numerous miracles continuing the legacy of Ilyas",
    ],
    mainChain: false,
    branchFromId: "ilyas",
    lineageNote:
      "Student of Ilyas ع — continued the Israelite prophetic mission",
  },

  {
    id: "yunus",
    name: "Yunus",
    arabicName: "يُونُس",
    title: "Companion of the Whale (Dhul-Nūn · Sāhib al-Hūt)",
    honorific: "ع",
    era: "~800–700 BCE, Assyria (modern Iraq/Syria)",
    nation: "Nineveh (Ninawa) — the great Assyrian city",
    family: {
      father: "Matta (Amittai) — from Banu Israil",
    },
    quranicMentions: 4,
    description:
      "Yunus عليه السلام was sent to the great city of Nineveh. When his people persisted in disbelief, he left before receiving divine permission — an act for which he was tested. He boarded a ship that was overloaded; lots were cast and he was thrown into the sea, where a great whale swallowed him. In the whale's belly he prayed the famous dua: 'There is no god but You, Glory be to You, I was among the wrongdoers.' Allah forgave him and commanded the whale to release him. He then returned to Nineveh — and 100,000 of its people believed.",
    keyEvents: [
      "Left Nineveh without divine permission after his people persisted in disbelief",
      "Cast overboard at sea; swallowed by a great whale",
      "Made dua in the whale's belly: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin'",
      "Expelled from the whale after Allah accepted his repentance",
      "Returned to Nineveh — 100,000 people believed and were saved from punishment",
    ],
    mainChain: false,
    branchFromId: "yaqub",
    lineageNote: "From Banu Israil — sent to the Assyrian city of Nineveh",
  },

  {
    id: "zakariyya",
    name: "Zakariyya",
    arabicName: "زَكَرِيَّا",
    title: "The Devoted Servant",
    honorific: "ع",
    era: "~1st century BCE, Jerusalem",
    nation: "Banu Israil — served the Temple in Jerusalem",
    family: {
      father: "Addo / Barachiah (from the priestly lineage of Sulayman/Dawud)",
      wives: [
        "Ishba (Elizabeth) — from the priestly family, relative of Maryam's mother",
      ],
      sons: [
        "Yahya عليه السلام (John the Baptist) — a miraculous birth in old age",
      ],
      notable: "Guardian of Maryam (mother of Isa) in the Temple",
    },
    quranicMentions: 7,
    description:
      "Zakariyya عليه السلام was a priest and prophet who served in Bayt al-Maqdis (Jerusalem Temple). He was guardian of the young Maryam and noticed she always had provision from Allah in her sanctuary. This inspired him to ask Allah for a righteous child, even in his extreme old age with an infertile wife. Allah answered with the miraculous news of Yahya — a son who would be given wisdom in childhood and who had never before been given that name.",
    keyEvents: [
      "Appointed guardian of Maryam in the Jerusalem Temple",
      "Noticed miraculous provisions appearing for Maryam — food from Allah",
      "Made dua for a righteous son despite extreme old age and infertile wife",
      "Received glad tidings of Yahya — angels called to him while he prayed",
      "Given the sign of three days of silence (unable to speak except by gestures)",
    ],
    mainChain: false,
    branchFromId: "sulayman",
    lineageNote:
      "From the priestly lineage of Dawud/Sulayman — served the Jerusalem Temple",
  },

  {
    id: "yahya",
    name: "Yahya",
    arabicName: "يَحْيَى",
    title: "John the Baptist — Given Wisdom as a Child",
    honorific: "ع",
    era: "~1st century BCE – 1st century CE, Jordan River area",
    nation: "Banu Israil",
    family: {
      father: "Zakariyya عليه السلام",
      mother: "Ishba (Elizabeth)",
      notable:
        "Relative and contemporary of Isa عليه السلام. His mother and Maryam (mother of Isa) were relatives.",
    },
    quranicMentions: 5,
    description:
      "Yahya عليه السلام is the son of Zakariyya, born miraculously to elderly parents. The Quran says Allah gave him wisdom (hukm) while still a child, as well as compassion, purity, and piety. He confirmed the word (Jesus/Isa) that was coming from Allah, preparing the people. The Quran gives him a three-fold salam: peace on the day he was born, the day he dies, and the day he is raised alive. He was martyred by an unjust king.",
    keyEvents: [
      "Born miraculously to elderly parents as a direct answer to Zakariyya's dua",
      "Given wisdom (hukm) by Allah from childhood — unique among the prophets",
      "Called to hold the scripture (Torah) firmly — he obeyed perfectly from youth",
      "Confirmed and bore witness to Isa عليه السلام as the Word of Allah",
      "Martyred by Herod (an unjust king) — his blood is said never to have dried",
    ],
    mainChain: false,
    branchFromId: "zakariyya",
    parentId: "zakariyya",
    lineageNote: "Son of Zakariyya ع — prophet in Jerusalem and Jordan region",
  },

  {
    id: "isa",
    name: "Isa",
    arabicName: "عِيسَى",
    title: "Spirit of Allah · Word of Allah · Al-Masih (The Messiah)",
    honorific: "ع",
    era: "~1st century BCE – 1st century CE, Palestine",
    nation: "Banu Israil — last prophet sent exclusively to them",
    family: {
      father: "No human father — born of a virgin mother by Allah's command",
      mother: "Maryam bint Imran عليها السلام — the best woman of the worlds",
      notable:
        "Maternal grandfather: Imran. Maternal grandmother: Hannah (Hanna bint Faqudh). " +
        "Maryam's lineage traced back to Dawud عليه السلام and thus to Yaqub عليه السلام. " +
        "Relative: Yahya عليه السلام (their mothers were relatives).",
    },
    quranicMentions: 25,
    description:
      "Isa عليه السلام (Jesus) is born miraculously of Maryam without a human father — as Allah says: 'The likeness of Isa before Allah is as the likeness of Adam; He created him from dust and said to him Be! and he was.' He is the Messiah (Al-Masih) and the Word of Allah (Kalimatullah) and a Spirit from Allah (Ruhullah). He spoke from the cradle as an infant, raised the dead, healed lepers and the blind, and brought the Injil (Gospel). The Quran affirms he was not crucified — rather Allah raised him alive to the heavens. He will return before the Day of Judgement.",
    keyEvents: [
      "Born miraculously to virgin Maryam — no human father; created by Allah's word 'Be!'",
      "Spoke from the cradle as a newborn, declaring himself a prophet",
      "Performed miracles: healed lepers and the blind, gave life to birds of clay, raised the dead",
      "Brought the Injil (Gospel) and confirmed the Torah",
      "Not crucified — Allah raised him alive to the heavens; he will return at End Times",
    ],
    mainChain: false,
    branchFromId: "dawud",
    lineageNote:
      "From Maryam (descendent of Dawud) — last prophet to Banu Israil",
  },
];

// ─── Tree Structure Helpers ───────────────────────────────────────────────────

/** Ordered IDs of the Adam → Ismail → Muhammad ﷺ main chain */
export const MAIN_CHAIN_IDS = [
  "adam",
  "idris",
  "nuh",
  "ibrahim",
  "ismail",
  "muhammad",
];

/** Prophets that branch directly from Ibrahim (excluding Ismail who is main chain) */
export const IBRAHIM_BRANCH_IDS = ["ishaq", "lut", "shuayb"];

/** Banu Israil prophets descending from Ishaq → Yaqub */
export const BANU_ISRAIL_CHAIN = [
  "ishaq",
  "yaqub",
  ["yusuf", "musa"], // siblings in same generation
  ["harun"], // brother of musa
  "ayyub",
  "dhul-kifl",
  "dawud",
  "sulayman",
  ["ilyas", "yunus"],
  "al-yasa",
  "zakariyya",
  "yahya",
  "isa",
];

/** Prophets sent to ancient Arab tribes (not in main Abrahamic genealogy) */
export const ARAB_TRIBAL_PROPHETS = ["hud", "salih"];

export function getProphetById(id: string): Prophet | undefined {
  return PROPHETS.find((p) => p.id === id);
}
