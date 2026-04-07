# 🧠 Tasbih Counter Web App – AI Agent Prompt

## 🎯 PRODUCT GOAL
Create a minimal yet powerful Islamic productivity app that:
- Helps users perform daily dhikr (tasbih)
- Tracks their progress (daily, weekly, monthly)
- Reminds them after each prayer
- Provides curated duas for barakah in rizk, health, and peace

---

## 🧩 CORE FEATURES

### 1. Tasbih Counter
- Digital counter with tap/click/keyboard support
- Smooth animation + haptic feedback (mobile)
- Ability to:
  - Reset counter
  - Save session
  - Select predefined dhikr:
    - SubhanAllah (33)
    - Alhamdulillah (33)
    - Allahu Akbar (34)
    - Custom dhikr input

---

### 2. Smart Prayer-Based Reminders
- Notify users after 5 daily prayers:
  - Fajr, Dhuhr, Asr, Maghrib, Isha
- Features:
  - Auto-detect user location (or manual selection)
  - Fetch prayer times via API
  - Push notifications (browser)
  - Custom reminder delay (e.g., 5–15 min after prayer)
  - Toggle on/off per prayer

---

### 3. Analytics Dashboard
- Show:
  - Daily dhikr count
  - Weekly total
  - Monthly total
- Visualization:
  - Bar chart (weekly activity)
  - Calendar heatmap (GitHub-style consistency tracker)
- Stats:
  - Current streak
  - Best streak
  - Total lifetime dhikr

---

### 4. Duas Section
Organize duas into categories:
- Rizk (wealth & sustenance)
- Health & protection
- Peace & anxiety

Each dua should include:
- Arabic text
- Transliteration
- English meaning
- Reference (Hadith/Quran if available)

---

### 5. Daily Reminder System (Core Feature)
- Daily motivational dhikr reminder:
  - Example: “Don’t forget your dhikr today 🤍”
- Smart behavior:
  - If user already completed dhikr → no reminder
  - Otherwise → send notification

---

### 6. Offline-First Support
- App should work offline
- Use local storage or IndexedDB for:
  - Dhikr counts
  - User preferences
- Sync when online (optional enhancement)

---

## 🎨 UI/UX REQUIREMENTS

- Design style:
  - Minimal, calming, spiritual (soft greens, dark mode support)
  - Inspired by modern apps like meditation trackers
- Mobile-first design
- Large tap area for counter (thumb-friendly)
- Smooth animations (Framer Motion)
- Accessibility:
  - High contrast
  - Readable Arabic font

---

## ⚙️ TECH STACK

### Frontend:
- React (with hooks)
- Tailwind CSS
- Zustand or Redux (state management)
- Framer Motion (animations)

### Backend (optional MVP → local-first):
- Node.js + Express OR Firebase
- MongoDB / Firestore

### APIs:
- Prayer Times API (e.g., Aladhan API)

### Notifications:
- Web Push API
- Service Workers (for background reminders)

---

## 🧠 ADVANCED FEATURES (Nice-to-Have)

- AI-powered dhikr suggestions based on user habits
- Personalized streak recovery suggestions
- Voice-based tasbih counter
- Widget mode (PWA installable app)
- Sync across devices (login system)

---

## 🏗️ ARCHITECTURE

- Component-based modular structure:
  - Counter Module
  - Reminder Module
  - Analytics Module
  - Duas Module
- Use clean architecture principles
- Separate UI, business logic, and API layers

---

## 🧪 TESTING

- Unit tests for:
  - Counter logic
  - Reminder scheduling
- Integration tests for:
  - API calls
- Ensure edge cases:
  - Offline usage
  - Timezone issues

---

## 🚀 DELIVERABLES

1. Fully working web app (PWA-ready)
2. Clean, modular, production-level code
3. README with:
   - Setup instructions
   - Architecture explanation
4. Optional: Deployment (Vercel / Netlify)

---

## 🔥 SUCCESS METRICS

- User completes daily dhikr consistently
- Increased streak retention
- Smooth and distraction-free UX

---

## ⚠️ CONSTRAINTS

- Keep UI simple (avoid clutter)
- Avoid unnecessary complexity
- Focus on performance and responsiveness

---

## 🏁 FINAL INSTRUCTION

Generate:
1. System design
2. Folder structure
3. Key components code
4. Reminder logic implementation
5. Sample UI screens

Ensure the solution is production-grade, scalable, and clean.
