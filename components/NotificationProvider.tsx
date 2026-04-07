"use client";

import { useEffect, useRef } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { LocalNotifications } from '@capacitor/local-notifications';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { prayerConfig } = usePreferencesStore();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear previous timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (!prayerConfig.enabled || typeof window === "undefined" || !("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    const fetchPrayerTimes = async () => {
      try {
        // Fetch today's prayer times
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${prayerConfig.city}&country=${prayerConfig.country}&method=2`);
        const data = await res.json();
        
        if (data.code === 200) {
          const timings = data.data.timings;
          
          const scheduleNotification = (prayer: string, timeStr: string) => {
            if (!(prayerConfig as any)[prayer.toLowerCase()]) return;
            
            const now = new Date();
            const [hours, minutes] = timeStr.split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(hours, minutes, 0, 0);
            
            // Add delay (e.g., 10 mins after prayer)
            const targetTime = new Date(prayerTime.getTime() + (prayerConfig.delayMinutes * 60000));
            
            const delayInMs = targetTime.getTime() - now.getTime();
            
            if (delayInMs > 0 && delayInMs < 86400000) { // within today
              try {
                LocalNotifications.schedule({
                  notifications: [{
                    title: `Time for Dhikr`,
                    body: `It's been ${prayerConfig.delayMinutes} mins since ${prayer}. Take a moment for Dhikr.`,
                    id: Math.floor(Math.random() * 100000),
                    schedule: { at: targetTime }
                  }]
                });
              } catch (e) {
                const timeoutId = setTimeout(() => {
                  new Notification(`Time for Dhikr`, {
                    body: `It's been ${prayerConfig.delayMinutes} mins since ${prayer}. Take a moment for Dhikr.`,
                    icon: "/favicon.ico"
                  });
                }, delayInMs);
                timeoutsRef.current.push(timeoutId);
              }
            }
          };

          scheduleNotification("Fajr", timings.Fajr);
          scheduleNotification("Dhuhr", timings.Dhuhr);
          scheduleNotification("Asr", timings.Asr);
          scheduleNotification("Maghrib", timings.Maghrib);
          scheduleNotification("Isha", timings.Isha);

          // Contextual Smart Reminders
          const now = new Date();
          
          // 1. Friday Salawat Reminder (Friday = 5, scheduled for 10:00 AM)
          if (now.getDay() === 5) {
            const jumaTime = new Date();
            jumaTime.setHours(10, 0, 0, 0);
            const delayInMs = jumaTime.getTime() - now.getTime();
            if (delayInMs > 0 && delayInMs < 86400000) {
              try {
                LocalNotifications.schedule({
                  notifications: [{
                    title: `Jumu'ah Mubarak`,
                    body: `It's Friday! Send 100 Salawat upon the Prophet (ﷺ) today for immense rewards.`,
                    id: Math.floor(Math.random() * 100000) + 1000,
                    schedule: { at: jumaTime }
                  }]
                });
              } catch (e) {
                const id = setTimeout(() => {
                  new Notification(`Jumu'ah Mubarak`, {
                    body: `It's Friday! Send 100 Salawat upon the Prophet (ﷺ) today for immense rewards.`,
                    icon: "/favicon.ico"
                  });
                }, delayInMs);
                timeoutsRef.current.push(id);
              }
            }
          }

          // 2. Tahajjud Reminder (3:00 AM next day or today if early morning)
          const tahajjudTime = new Date();
          if (now.getHours() >= 3) {
            tahajjudTime.setDate(tahajjudTime.getDate() + 1);
          }
          tahajjudTime.setHours(3, 30, 0, 0); // approx 3:30 AM
          const tDelayInMs = tahajjudTime.getTime() - now.getTime();
          if (tDelayInMs > 0 && tDelayInMs < 86400000) {
            try {
              LocalNotifications.schedule({
                notifications: [{
                  title: `Tahajjud Time`,
                  body: `The last third of the night has entered. Wake up for a moment of Dhikr and dua.`,
                  id: Math.floor(Math.random() * 100000) + 2000,
                  schedule: { at: tahajjudTime }
                }]
              });
            } catch (e) {
              const id = setTimeout(() => {
                new Notification(`Tahajjud Time`, {
                  body: `The last third of the night has entered. Wake up for a moment of Dhikr and dua.`,
                  icon: "/favicon.ico"
                });
              }, tDelayInMs);
              timeoutsRef.current.push(id);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch prayer times:", e);
      }
    };

    fetchPrayerTimes();
    
    // Refresh daily at midnight + 1min
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 1, 0).getTime() - now.getTime();
    const dailyTimer = setTimeout(fetchPrayerTimes, msUntilMidnight);
    timeoutsRef.current.push(dailyTimer);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [prayerConfig]);

  return <>{children}</>;
}
