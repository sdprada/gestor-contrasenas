import { createFileRoute } from "@tanstack/react-router";
import { Shield, Target, Zap, Crown, Key, Sparkles, Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageStack } from "@/components/layout/PageContainer";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { ACHIEVEMENTS } from "@/stores/useGamificationStore";
import { useGuardian } from "@/hooks/useGuardian";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Logros · Guardián de Contraseñas" },
      {
        name: "description",
        content:
          "Tu progreso en gamificación: logros desbloqueados y por desbloquear.",
      },
    ],
  }),
  component: Achievements,
});

const ICONS = {
  shield: Shield,
  target: Target,
  zap: Zap,
  crown: Crown,
  key: Key,
  sparkles: Sparkles,
};

function Achievements() {
  const { progressMap, unlocked, totalAchievements } = useGuardian();
  const pct = Math.round((unlocked / totalAchievements) * 100);

  return (
    <PageStack>
      <PageHeader
        title="Logros"
        description={`${unlocked} de ${totalAchievements} desbloqueados · ${pct}% completado`}
        actions={
          <div className="relative size-20">
            <svg viewBox="0 0 36 36" className="size-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="url(#g)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${pct} 100`}
              />
              <defs>
                <linearGradient id="g">
                  <stop offset="0%" stopColor="oklch(0.55 0.2 295)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 350)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-label tabular text-foreground">
              {pct}%
            </span>
          </div>
        }
      />

      <ResponsiveGrid base={1} sm={2} lg={3} xl={4} gap="md">
        {ACHIEVEMENTS.map((a) => {
          const cur = progressMap[a.id] ?? 0;
          const done = cur >= a.goal;
          const barPct = Math.min(100, (cur / a.goal) * 100);
          const Icon = ICONS[a.icon];
          return (
            <Card
              key={a.id}
              padding="md"
              className={cn(
                "relative overflow-hidden",
                done &&
                  "border-transparent bg-gradient-to-br from-primary to-accent-pink text-primary-foreground shadow-celebrate",
              )}
            >
              {done && (
                <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-accent-amber">
                  <Check className="size-3.5 text-background" />
                </div>
              )}
              <div
                className={cn(
                  "mb-3 inline-flex size-11 items-center justify-center rounded-xl",
                  done ? "bg-white/20" : "tone-primary",
                )}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="text-h3">{a.name}</h3>
              <p
                className={cn(
                  "mt-1 text-body-sm",
                  done ? "text-primary-foreground/80" : "text-foreground-muted",
                )}
              >
                {a.description}
              </p>
              <div className="mt-4">
                <div
                  className={cn(
                    "h-1.5 overflow-hidden rounded-full",
                    done ? "bg-white/20" : "bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "h-full",
                      done ? "bg-white" : "bg-gradient-xp",
                    )}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <p
                  className={cn(
                    "mt-1.5 text-caption tabular",
                    done
                      ? "text-primary-foreground/80"
                      : "text-foreground-muted",
                  )}
                >
                  {Math.min(cur, a.goal)} / {a.goal}
                </p>
              </div>
            </Card>
          );
        })}
      </ResponsiveGrid>
    </PageStack>
  );
}
