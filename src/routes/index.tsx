import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, Trophy, ShieldCheck, Star, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageStack } from "@/components/layout/PageContainer";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { StatCard } from "@/components/shared/StatCard";
import { MascotAvatar } from "@/components/guardian/MascotAvatar";
import { XpBar } from "@/components/guardian/XpBar";
import { useEffect } from "react";
import { useGuardian } from "@/hooks/useGuardian";
import { useUiStore } from "@/stores/useUiStore";
import { useVaultStore } from "@/stores/useVaultStore";
import { getServiceInfo } from "@/lib/services";
import { ACHIEVEMENTS } from "@/stores/useGamificationStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Guardián de Contraseñas" },
      {
        name: "description",
        content:
          "Resumen de tu bóveda: estado del guardián, KPIs de seguridad y favoritas.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    entries,
    strongCount,
    favCount,
    unlocked,
    totalAchievements,
    level,
    xp,
    xpInLevel,
    xpNeeded,
    progressMap,
  } = useGuardian();
  const openAdd = useUiStore((s) => s.openAdd);
  const fetchEntries = useVaultStore((s) => s.fetchEntries);
  const favorites = entries.filter((e) => e.favorite).slice(0, 6);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const securityScore =
    entries.length === 0 ? 0 : Math.round((strongCount / entries.length) * 100);

  return (
    <PageStack>
      {/* Hero */}
      <Card variant="gradient" padding="xl" className="overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <MascotAvatar size="lg" level={level} />
          <div className="flex-1">
            <p className="text-overline text-primary">Bienvenida de vuelta</p>
            <h1 className="mt-1 text-h1 text-foreground">
              Tu guardián está nivel {level}
            </h1>
            <p className="mt-1 text-body-sm text-foreground-muted">
              Protegiendo {entries.length} contraseñas · {securityScore}% en
              estado fuerte
            </p>
            <div className="mt-4 max-w-md">
              <XpBar value={xpInLevel} max={xpNeeded} />
              <div className="mt-1.5 flex justify-between text-caption text-foreground-muted tabular">
                <span>{xpInLevel} XP en este nivel</span>
                <span>{xp} XP totales</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 lg:flex-col">
            <Button onClick={openAdd} variant="xp">
              + Nueva contraseña
            </Button>
            <Button asChild variant="outline">
              <Link to="/vault">
                Abrir bóveda <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <ResponsiveGrid base={1} sm={2} lg={4} gap="md">
        <StatCard
          label="Contraseñas"
          value={entries.length}
          icon={KeyRound}
          tone="primary"
        />
        <StatCard
          label="Fuertes"
          value={strongCount}
          icon={ShieldCheck}
          tone="success"
        />
        <StatCard
          label="Favoritas"
          value={favCount}
          icon={Star}
          tone="amber"
        />
        <StatCard
          label="Logros"
          value={`${unlocked}/${totalAchievements}`}
          icon={Trophy}
          tone="orange"
        />
      </ResponsiveGrid>

      <ResponsiveGrid base={1} lg={3} gap="lg">
        {/* Favoritas */}
        <Card padding="lg" className="lg:col-span-2">
          <SectionContainer
            title="Favoritas"
            description="Acceso rápido a las contraseñas que más usas."
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link to="/vault">
                  Ver todas <ArrowRight className="size-3" />
                </Link>
              </Button>
            }
          >
            {favorites.length === 0 ? (
              <p className="py-8 text-center text-body-sm text-foreground-muted">
                Marca tus favoritas con la estrella para verlas aquí.
              </p>
            ) : (
              <ResponsiveGrid base={1} sm={2} xl={3} gap="sm">
                {favorites.map((e) => {
                  const svc = getServiceInfo(e.service);
                  const Icon = svc.icon;
                  return (
                    <Link
                      key={e.id}
                      to="/vault/$id"
                      params={{ id: e.id }}
                      className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-standard hover:border-border-strong hover:shadow-sm"
                    >
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg text-white",
                          svc.color,
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-label text-foreground">
                          {e.name}
                        </p>
                        <p className="truncate text-caption text-foreground-muted">
                          {e.username}
                        </p>
                      </div>
                      <Star className="size-4 fill-accent-amber text-accent-amber" />
                    </Link>
                  );
                })}
              </ResponsiveGrid>
            )}
          </SectionContainer>
        </Card>

        {/* Logros recientes */}
        <Card padding="lg">
          <SectionContainer
            title="Logros"
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link to="/achievements">
                  Ver todos <ArrowRight className="size-3" />
                </Link>
              </Button>
            }
          >
            <div className="flex flex-col gap-3">
              {ACHIEVEMENTS.slice(0, 4).map((a) => {
                const cur = progressMap[a.id] ?? 0;
                const done = cur >= a.goal;
                const pct = Math.min(100, (cur / a.goal) * 100);
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg text-sm font-bold",
                        done
                          ? "bg-gradient-trophy text-white"
                          : "bg-muted text-foreground-muted",
                      )}
                    >
                      {done ? "✓" : Math.min(cur, a.goal)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-label text-foreground">
                        {a.name}
                      </p>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full",
                            done ? "bg-success" : "bg-primary",
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-caption text-foreground-muted tabular">
                      {Math.min(cur, a.goal)}/{a.goal}
                    </span>
                  </div>
                );
              })}
            </div>
          </SectionContainer>
        </Card>
      </ResponsiveGrid>

    </PageStack>
  );
}
