import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  linkWithPopup,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase";
import {
  uploadLocalDataToFirestore,
  fetchUserData,
  syncToFirestore,
} from "@/lib/syncService";
import { useDhikrStore } from "./useDhikrStore";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Actions
  initAuth: () => () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  linkAnonymousToGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
  clearError: () => void;
}

// Debounce timer for Firestore writes
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  error: null,

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      set({ user, loading: false, initialized: true });

      if (user) {
        try {
          // On sign-in: merge local data to Firestore, then hydrate from Firestore
          const dhikrState = useDhikrStore.getState();
          await uploadLocalDataToFirestore(user.uid, {
            totalLifetimeCount: dhikrState.totalLifetimeCount,
            history: dhikrState.history,
            streaks: dhikrState.streaks,
            badges: dhikrState.badges,
            dailyChallenge: dhikrState.dailyChallenge,
          });

          const remoteData = await fetchUserData(user.uid);
          if (remoteData) {
            useDhikrStore.getState().hydrateFromRemote(remoteData);
          }
        } catch (err) {
          console.error("Sync on auth failed:", err);
        }
      }
    });

    return unsubscribe;
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      set({ error: message, loading: false });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      set({ error: message, loading: false });
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );
      if (displayName) {
        await updateProfile(credential.user, { displayName });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign-up failed";
      set({ error: message, loading: false });
    }
  },

  resetPassword: async (email) => {
    set({ error: null });
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Password reset failed";
      set({ error: message });
    }
  },

  signInAnonymously: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignInAnonymously(getFirebaseAuth());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Anonymous sign-in failed";
      set({ error: message, loading: false });
    }
  },

  linkAnonymousToGoogle: async () => {
    const { user } = get();
    if (!user || !user.isAnonymous) return;

    set({ loading: true, error: null });
    try {
      await linkWithPopup(user, getGoogleProvider());
      set({ user: getFirebaseAuth().currentUser });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Account linking failed";
      set({ error: message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(getFirebaseAuth());
      set({ user: null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign-out failed";
      set({ error: message, loading: false });
    }
  },

  syncNow: async () => {
    const { user } = get();
    if (!user) return;

    // Debounce: wait 2s after last call
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
      try {
        const dhikrState = useDhikrStore.getState();
        await syncToFirestore(user.uid, {
          totalLifetimeCount: dhikrState.totalLifetimeCount,
          history: dhikrState.history,
          streaks: dhikrState.streaks,
          badges: dhikrState.badges,
          dailyChallenge: dhikrState.dailyChallenge,
        });
      } catch (err) {
        console.error("Sync failed:", err);
      }
    }, 2000);
  },

  clearError: () => set({ error: null }),
}));
