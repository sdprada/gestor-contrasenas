import { useVaultStore } from "@/stores/useVaultStore";
import { useGamificationStore, ACHIEVEMENTS } from "@/stores/useGamificationStore";
import { scoreStrength } from "@/lib/strength";

export function useGuardian() {
  const entries = useVaultStore((s) => s.entries);
  const copyCount = useGamificationStore((s) => s.copyCount);
  const paletteUsed = useGamificationStore((s) => s.paletteUsed);

  const strongCount = entries.filter((e) => scoreStrength(e.password) >= 3)
    .length;
  const favCount = entries.filter((e) => e.favorite).length;

  const progressMap: Record<string, number> = {
    "first-step": Math.min(1, entries.length),
    collector: entries.length,
    "swift-guardian": copyCount,
    master: strongCount,
    explorer: paletteUsed,
    polish: favCount,
  };

  const unlocked = ACHIEVEMENTS.filter(
    (a) => progressMap[a.id] >= a.goal,
  ).length;

  // XP: 10 per password, 5 per strong, 2 per copy, 50 per achievement
  const xp =
    entries.length * 10 + strongCount * 5 + copyCount * 2 + unlocked * 50;

  // Level curve: 100, 250, 450, 700, 1000... triangular-ish
  const levels = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];
  let level = 1;
  for (let i = 1; i < levels.length; i++) {
    if (xp >= levels[i]) level = i + 1;
  }
  const currentBase = levels[level - 1] ?? 0;
  const nextBase = levels[level] ?? currentBase + 1000;
  const xpInLevel = xp - currentBase;
  const xpNeeded = nextBase - currentBase;

  return {
    entries,
    strongCount,
    favCount,
    unlocked,
    totalAchievements: ACHIEVEMENTS.length,
    xp,
    level,
    xpInLevel,
    xpNeeded,
    progressMap,
  };
}
