/** Shared 5-daily-prayers list used in Settings and Profile. */
export const PRAYER_LIST = [
  { id: "fajr", label: "Fajr" },
  { id: "dhuhr", label: "Dhuhr" },
  { id: "asr", label: "Asr" },
  { id: "maghrib", label: "Maghrib" },
  { id: "isha", label: "Isha" },
] as const;

/** Tree-of-Jannah milestone thresholds used in Analytics and Profile. */
export const TREE_MILESTONES = [
  { threshold: 0, visual: "🌱", status: "A Seed Planted" },
  { threshold: 100, visual: "🪴", status: "Sprouting Plant" },
  { threshold: 1000, visual: "🌿", status: "Growing Sapling" },
  { threshold: 5000, visual: "🌳", status: "Firmly Rooted Tree" },
  { threshold: 10000, visual: "🌲", status: "Evergreen Cedar" },
] as const;

/** Returns the current tree stage based on lifetime dhikr count. */
export function getTreeStage(totalLifetimeCount: number): {
  threshold: number;
  visual: string;
  status: string;
} {
  let stage: { threshold: number; visual: string; status: string } =
    TREE_MILESTONES[0];
  for (const milestone of TREE_MILESTONES) {
    if (totalLifetimeCount > milestone.threshold) stage = milestone;
  }
  return stage;
}

/** Returns the next milestone threshold to progress towards. */
export function getNextMilestone(totalLifetimeCount: number): number {
  const thresholds = [100, 1000, 5000, 10000, 50000];
  return thresholds.find((t) => totalLifetimeCount < t) ?? 50000;
}
