import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

interface SyncableData {
  totalLifetimeCount: number;
  history: { date: string; count: number }[];
  streaks: { current: number; best: number; lastActiveDate: string | null };
  badges: string[];
  dailyChallenge: {
    date: string;
    dhikrId: string;
    progress: number;
    target: number;
    completed: boolean;
  };
}

/**
 * Upload local dhikr data to Firestore (merge strategy).
 * Called on first sign-in to migrate localStorage data.
 */
export async function uploadLocalDataToFirestore(
  uid: string,
  localState: SyncableData
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    // Merge: keep the higher lifetime count, longer streaks, union badges
    const remote = snapshot.data() as SyncableData;
    const merged: SyncableData = {
      totalLifetimeCount: Math.max(
        remote.totalLifetimeCount || 0,
        localState.totalLifetimeCount
      ),
      history: mergeHistory(remote.history || [], localState.history),
      streaks: {
        current: Math.max(
          remote.streaks?.current || 0,
          localState.streaks.current
        ),
        best: Math.max(remote.streaks?.best || 0, localState.streaks.best),
        lastActiveDate:
          remote.streaks?.lastActiveDate || localState.streaks.lastActiveDate,
      },
      badges: [
        ...new Set([...(remote.badges || []), ...localState.badges]),
      ],
      dailyChallenge: localState.dailyChallenge, // prefer local (most recent)
    };
    await setDoc(userRef, merged, { merge: true });
  } else {
    await setDoc(userRef, {
      ...localState,
      createdAt: new Date().toISOString(),
    });
  }
}

/**
 * Fetch user data from Firestore.
 */
export async function fetchUserData(
  uid: string
): Promise<SyncableData | null> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data() as SyncableData;
  }
  return null;
}

/**
 * Sync current state to Firestore (debounced externally).
 */
export async function syncToFirestore(
  uid: string,
  data: Partial<SyncableData>
): Promise<void> {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    await updateDoc(userRef, data as Record<string, unknown>);
  } else {
    await setDoc(userRef, { ...data, createdAt: new Date().toISOString() });
  }
}

/**
 * Merge two history arrays, summing counts for overlapping dates.
 */
function mergeHistory(
  remote: { date: string; count: number }[],
  local: { date: string; count: number }[]
): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of remote) {
    map.set(r.date, (map.get(r.date) || 0) + r.count);
  }
  for (const l of local) {
    // For overlapping dates, take the max rather than summing
    // (since both sources counted the same session)
    map.set(l.date, Math.max(map.get(l.date) || 0, l.count));
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
