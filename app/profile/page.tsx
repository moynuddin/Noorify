"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useDhikrStore } from "@/store/useDhikrStore";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogIn,
  LogOut,
  Flame,
  Trophy,
  Calendar,
  Sparkles,
  Medal,
  Bell,
  MapPin,
  Vibrate,
  ChevronRight,
  Shield,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { format, subDays } from "date-fns";
import { useState, useEffect } from "react";
import {
  PRAYER_LIST,
  getTreeStage,
  getNextMilestone,
} from "@/constants/prayers";
import { THEME_OPTIONS } from "@/constants/settings";

export default function ProfilePage() {
  const { user, loading, logout, linkAnonymousToGoogle } = useAuthStore();
  const { totalLifetimeCount, history, streaks, badges, dailyChallenge } =
    useDhikrStore();
  const {
    theme,
    setTheme,
    prayerConfig,
    updatePrayerConfig,
    hapticEnabled,
    toggleHaptic,
  } = usePreferencesStore();

  const [hasPermission, setHasPermission] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === "granted");
      if (permission === "granted") {
        updatePrayerConfig({ enabled: true });
        // Fire an immediate confirmation so the user sees it's working
        new Notification("Dhikr Reminders Enabled ✓", {
          body: "You'll be reminded to do Dhikr after your selected prayers.",
          icon: "/favicon.ico",
        });
      } else if (permission === "denied") {
        alert(
          "Notifications were blocked. Please enable them in your browser's site settings and reload.",
        );
      }
    }
  };

  // Weekly chart data
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    const record = history.find((r) => r.date === dateStr);
    return {
      date: dateStr,
      label: format(d, "EEE"),
      count: record ? record.count : 0,
    };
  });
  const maxCount = Math.max(...last7Days.map((d) => d.count), 1);

  // Tree of Jannah
  const { visual: TreeVisual, status: TreeStatus } =
    getTreeStage(totalLifetimeCount);
  const nextMilestone = getNextMilestone(totalLifetimeCount);
  const treeProgress = Math.min(
    (totalLifetimeCount / nextMilestone) * 100,
    100,
  );

  // Daily goal completion rate (days where daily challenge was completed in last 30 days)
  const last30 = Array.from({ length: 30 }).map((_, i) =>
    format(subDays(new Date(), i), "yyyy-MM-dd"),
  );
  const activeDays = last30.filter((d) =>
    history.find((r) => r.date === d && r.count >= 33),
  );
  const completionRate = Math.round((activeDays.length / 30) * 100);

  const prayers = PRAYER_LIST;

  const memberSince =
    user && !user.isAnonymous && user.metadata?.creationTime
      ? format(new Date(user.metadata.creationTime), "MMMM yyyy")
      : null;

  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 pb-32 min-h-screen transition-all duration-300">
      {/* Page title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-8 tracking-tight text-foreground"
      >
        Profile
      </motion.h1>

      <div className="space-y-8">
        {/* ── User Card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-400 text-white p-6 rounded-3xl shadow-lg"
        >
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 blur-3xl rounded-full pointer-events-none" />
          {loading ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/20 rounded-full w-32 animate-pulse" />
                <div className="h-3 bg-white/20 rounded-full w-48 animate-pulse" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4 relative z-10">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full border-2 border-white/40 flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <User size={28} />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-lg leading-tight truncate">
                  {user.displayName ||
                    (user.isAnonymous ? "Guest" : user.email?.split("@")[0])}
                </p>
                {user.isAnonymous ? (
                  <p className="text-brand-100 text-sm mt-0.5">
                    Browsing as guest
                  </p>
                ) : (
                  <p className="text-brand-100 text-sm mt-0.5 truncate">
                    {user.email}
                  </p>
                )}
                {memberSince && (
                  <p className="text-brand-200 text-xs mt-1">
                    Member since {memberSince}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="font-bold text-lg">Not signed in</p>
                <p className="text-brand-100 text-sm mt-0.5">
                  Sign in to sync your progress
                </p>
              </div>
              <Link
                href="/auth"
                className="flex items-center gap-2 bg-white text-brand-600 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex-shrink-0"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            </div>
          )}
        </motion.div>

        {/* Upgrade prompt for anonymous users */}
        {user?.isAnonymous && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5 flex items-start gap-4"
          >
            <Shield size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">Save your progress</p>
              <p className="text-xs text-foreground/60 mt-1">
                Create an account to back up your dhikr data across devices.
              </p>
            </div>
            <button
              onClick={linkAnonymousToGoogle}
              className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              <LinkIcon size={12} />
              Upgrade
            </button>
          </motion.div>
        )}

        {/* ── Progress Stats ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
            Your Progress
          </h2>

          {/* Lifetime count hero */}
          <div className="bg-card-bg border border-card-border rounded-3xl p-6 mb-4 flex items-center gap-5 shadow-sm">
            <div className="text-4xl">{TreeVisual}</div>
            <div className="flex-1">
              <p className="text-xs text-foreground/50 uppercase font-semibold tracking-wider mb-1">
                Lifetime Dhikr
              </p>
              <p className="text-4xl font-bold tabular-nums text-foreground">
                {totalLifetimeCount.toLocaleString()}
              </p>
              <p className="text-xs text-foreground/50 mt-1">{TreeStatus}</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col items-center shadow-sm">
              <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                <Flame size={18} className="text-orange-500" />
              </div>
              <span className="text-2xl font-bold tabular-nums">
                {streaks.current}
              </span>
              <span className="text-[10px] text-foreground/50 uppercase tracking-wide font-medium text-center">
                Streak
              </span>
            </div>
            <div className="bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col items-center shadow-sm">
              <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center mb-2">
                <Trophy size={18} className="text-brand-500" />
              </div>
              <span className="text-2xl font-bold tabular-nums">
                {streaks.best}
              </span>
              <span className="text-[10px] text-foreground/50 uppercase tracking-wide font-medium text-center">
                Best
              </span>
            </div>
            <div className="bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col items-center shadow-sm">
              <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <Calendar size={18} className="text-green-500" />
              </div>
              <span className="text-2xl font-bold tabular-nums">
                {completionRate}%
              </span>
              <span className="text-[10px] text-foreground/50 uppercase tracking-wide font-medium text-center">
                30d Rate
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Tree of Jannah ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-400 text-white p-6 rounded-3xl shadow-lg"
        >
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-100 flex items-center gap-2 mb-3">
              <Sparkles size={13} /> The Tree of Jannah
            </h3>
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-5xl mb-2 drop-shadow-md filter saturate-150">
                  {TreeVisual}
                </div>
                <p className="font-semibold text-lg">{TreeStatus}</p>
              </div>
              <div className="text-right text-brand-100 text-sm">
                <p className="font-bold text-white text-2xl tabular-nums">
                  {totalLifetimeCount.toLocaleString()}
                </p>
                <p className="text-xs mt-0.5">
                  Next: {nextMilestone.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden border border-black/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${treeProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-white h-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Weekly Activity ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg border border-card-border rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={16} className="text-brand-500" />
            <h2 className="font-semibold text-sm">Last 7 Days</h2>
          </div>
          <div className="flex items-end justify-between h-28 gap-2">
            {last7Days.map((day, i) => {
              const heightPct = Math.max((day.count / maxCount) * 100, 4);
              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center flex-1 gap-2 group"
                >
                  <div className="w-full relative h-[80px] bg-foreground/5 rounded-t-lg overflow-hidden flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{
                        delay: 0.3 + i * 0.04,
                        duration: 0.5,
                        type: "spring",
                      }}
                      className="w-full bg-brand-400 dark:bg-brand-500 rounded-t-lg group-hover:bg-brand-500 dark:group-hover:bg-brand-400 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] text-foreground/50 font-medium uppercase">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Badges ─────────────────────────────────────────── */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-4 px-2">
              <Medal size={16} className="text-yellow-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">
                Badges
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b}
                  className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-2xl flex items-center gap-3"
                >
                  <span className="text-lg">🏆</span>
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Settings ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
            Appearance
          </h2>
          <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 p-1 bg-foreground/5 gap-1 m-3 rounded-2xl">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as "light" | "dark" | "system")}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                    theme === t.id
                      ? "bg-card-bg shadow-sm text-brand-500"
                      : "text-foreground/60 hover:bg-foreground/10"
                  }`}
                >
                  <t.icon size={18} />
                  <span className="text-[10px] font-medium">{t.label}</span>
                </button>
              ))}
            </div>
            <div className="p-4 flex items-center justify-between border-t border-card-border/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                  <Vibrate size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm">Haptic Feedback</p>
                  <p className="text-[10px] text-foreground/50">
                    Vibrate on tap
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hapticEnabled}
                  onChange={toggleHaptic}
                />
                <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
              </label>
            </div>
          </div>
        </motion.div>

        {/* Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
            Smart Reminders
          </h2>
          <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-card-border/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Bell size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Push Notifications</p>
                    <p className="text-xs text-foreground/50 max-w-[200px]">
                      Get reminded to do Dhikr after daily prayers.
                    </p>
                  </div>
                </div>
                {!hasPermission ? (
                  <button
                    onClick={requestPermission}
                    className="text-xs font-semibold bg-brand-500 text-white px-3 py-1.5 rounded-full hover:bg-brand-600 transition flex-shrink-0"
                  >
                    Enable
                  </button>
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={prayerConfig.enabled}
                      onChange={() =>
                        updatePrayerConfig({ enabled: !prayerConfig.enabled })
                      }
                    />
                    <div className="w-11 h-6 bg-card-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
                  </label>
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-300 ${!prayerConfig.enabled || !hasPermission ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="p-5 border-b border-card-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={14} className="text-foreground/50" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={prayerConfig.city}
                    onChange={(e) =>
                      updatePrayerConfig({ city: e.target.value })
                    }
                    className="bg-foreground/5 border border-card-border rounded-xl px-3 py-2 text-sm w-full outline-none focus:border-brand-500"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={prayerConfig.country}
                    onChange={(e) =>
                      updatePrayerConfig({ country: e.target.value })
                    }
                    className="bg-foreground/5 border border-card-border rounded-xl px-3 py-2 text-sm w-full outline-none focus:border-brand-500"
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                  Remind me after:
                </p>
                {prayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{prayer.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={
                          (prayerConfig as Record<string, unknown>)[
                            prayer.id
                          ] as boolean
                        }
                        onChange={(e) =>
                          updatePrayerConfig({ [prayer.id]: e.target.checked })
                        }
                      />
                      <div className="w-9 h-5 bg-card-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Account Actions ──────────────────────────────────── */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
              Account
            </h2>
            <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm divide-y divide-card-border/50">
              {user.isAnonymous && (
                <button
                  onClick={linkAnonymousToGoogle}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-foreground/5 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500 flex-shrink-0">
                    <LinkIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Link Google Account</p>
                    <p className="text-xs text-foreground/50">
                      Save your data permanently
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-foreground/30" />
                </button>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-500/5 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
                  <LogOut size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-500">Sign Out</p>
                </div>
                <ChevronRight size={16} className="text-foreground/30" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Not signed in CTA */}
        {!user && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
              Account
            </h2>
            <div className="bg-card-bg border border-card-border rounded-3xl p-5 text-center">
              <p className="text-sm text-foreground/60 mb-4">
                Sign in to sync your dhikr progress across all your devices.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-brand-600 transition-all shadow-sm"
              >
                <LogIn size={16} />
                Sign In / Create Account
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
