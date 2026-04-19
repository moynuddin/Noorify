"use client";

import { usePreferencesStore } from "@/store/usePreferencesStore";
import { motion } from "framer-motion";
import { Bell, MapPin, Vibrate } from "lucide-react";
import { PRAYER_LIST } from "@/constants/prayers";
import { THEME_OPTIONS } from "@/constants/settings";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    prayerConfig,
    updatePrayerConfig,
    hapticEnabled,
    toggleHaptic,
  } = usePreferencesStore();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setHasPermission(permission === "granted");

      if (permission === "granted") {
        updatePrayerConfig({ enabled: true });
        new Notification("Dhikr Assitant", {
          body: "Notifications enabled successfully! You'll be reminded for Dhikr.",
          icon: "/favicon.ico",
        });
      }
    }
  };

  const prayers = PRAYER_LIST;

  return (
    <div className="px-4 sm:px-8 md:px-12 py-8 md:py-12 pb-32 md:pb-40 min-h-screen transition-all duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 tracking-tight text-foreground"
      >
        Settings
      </motion.h1>

      <div className="space-y-8 md:space-y-12">
        {/* Appearance Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm md:text-base font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
            Appearance
          </h2>
          <div className="bg-card-bg border border-card-border rounded-3xl md:rounded-[2rem] overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 p-1 bg-foreground/5 gap-1 m-2 md:m-4 rounded-2xl md:rounded-3xl">
              {THEME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`flex flex-col items-center gap-1.5 md:gap-2 py-3 md:py-5 rounded-xl md:rounded-2xl transition-all ${
                    theme === t.id
                      ? "bg-card-bg shadow-sm text-brand-500"
                      : "text-foreground/60 hover:bg-foreground/10"
                  }`}
                >
                  <t.icon size={18} className="md:w-6 md:h-6" />
                  <span className="text-[10px] md:text-sm font-medium">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6 flex items-center justify-between border-t border-card-border/50">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-500">
                  <Vibrate size={16} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base">
                    Haptic Feedback
                  </p>
                  <p className="text-[10px] md:text-xs text-foreground/50">
                    Vibrate on tap (supported devices)
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
                <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
          </div>
        </motion.section>

        {/* Reminders Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm md:text-base font-semibold uppercase tracking-wider text-foreground/50 mb-4 px-2">
            Smart Reminders
          </h2>
          <div className="bg-card-bg border border-card-border rounded-3xl md:rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-5 md:p-8 border-b border-card-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Bell size={20} className="md:w-7 md:h-7" />
                  </div>
                  <div>
                    <p className="font-semibold text-base md:text-lg">
                      Push Notifications
                    </p>
                    <p className="text-xs md:text-sm text-foreground/50 max-w-[200px] md:max-w-xs">
                      Get reminded to do Dhikr after daily prayers.
                    </p>
                  </div>
                </div>
                {!hasPermission ? (
                  <button
                    onClick={requestPermission}
                    className="text-xs md:text-sm font-semibold bg-brand-500 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full hover:bg-brand-600 transition"
                  >
                    Enable
                  </button>
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={prayerConfig.enabled}
                      onChange={() =>
                        updatePrayerConfig({ enabled: !prayerConfig.enabled })
                      }
                    />
                    <div className="w-11 h-6 bg-card-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                  </label>
                )}
              </div>
            </div>

            <div
              className={`transition-all duration-300 ${!prayerConfig.enabled || !hasPermission ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="p-5 md:p-8 border-b border-card-border/50">
                <div className="flex items-center gap-3 mb-3 md:mb-5">
                  <MapPin
                    size={16}
                    className="text-foreground/50 md:w-5 md:h-5"
                  />
                  <span className="text-sm md:text-base font-medium">
                    Location Setting
                  </span>
                </div>
                <div className="flex gap-3 md:gap-5">
                  <input
                    type="text"
                    value={prayerConfig.city}
                    onChange={(e) =>
                      updatePrayerConfig({ city: e.target.value })
                    }
                    className="bg-foreground/5 border border-card-border rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base w-full outline-none focus:border-brand-500"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={prayerConfig.country}
                    onChange={(e) =>
                      updatePrayerConfig({ country: e.target.value })
                    }
                    className="bg-foreground/5 border border-card-border rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base w-full outline-none focus:border-brand-500"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="p-5 md:p-8 space-y-4 md:space-y-6">
                <p className="text-xs md:text-sm font-semibold uppercase tracking-wider text-foreground/40 mb-2 md:mb-4">
                  Remind me after:
                </p>
                {prayers.map((prayer) => (
                  <div
                    key={prayer.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm md:text-base font-medium">
                      {prayer.label}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={(prayerConfig as any)[prayer.id]}
                        onChange={(e) =>
                          updatePrayerConfig({ [prayer.id]: e.target.checked })
                        }
                      />
                      <div className="w-9 h-5 bg-card-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
