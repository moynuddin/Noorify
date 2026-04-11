"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDhikrStore } from "@/store/useDhikrStore";

/**
 * Client-side component that initialises the Firebase auth listener.
 * Also subscribes to dhikr store changes and syncs to Firestore.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();
    return unsubscribe;
  }, [initAuth]);

  // Subscribe to dhikr increments and sync to Firestore
  useEffect(() => {
    const unsub = useDhikrStore.subscribe((state, prevState) => {
      if (state.totalLifetimeCount !== prevState.totalLifetimeCount) {
        const { user } = useAuthStore.getState();
        if (user) {
          useAuthStore.getState().syncNow();
        }
      }
    });
    return unsub;
  }, []);

  return <>{children}</>;
}
