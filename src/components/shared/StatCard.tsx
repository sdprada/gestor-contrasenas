import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "destructive" | "amber" | "orange" | "pink";

const TONE_CLASS: Record<Tone, string> = {
  primary: "tone-primary",
  success: "tone-success",
  warning: "tone-warning",
  destructive: "tone-destructive",
  amber: "tone-amber",
  orange: "tone-orange",
  pink: "tone-pink",
};

interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: LucideIcon;
  tone?: Tone;
  /** Optional trailing meta (e.g. "+12% esta semana"). */
  hint?: React.ReactNode;
  className?: string;
}

/**
 * StatCard — KPI tile.
 *
 * Centralizes the icon-badge + numeric value + label pattern that was
 * duplicated across Dashboard. Tones map to semantic surface utilities
 * so light/dark modes stay in sync.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
  className,
}: StatCardProps) {
  return (
    <Card padding="md" className={className}>
      {Icon ? (
        <div
          className={cn(
            "mb-3 inline-flex size-9 items-center justify-center rounded-lg",
            TONE_CLASS[tone],
          )}
        >
          <Icon className="size-4" />
        </div>
      ) : null}
      <p className="text-h1 tabular text-foreground">{value}</p>
      <p className="mt-0.5 text-body-sm text-foreground-muted">{label}</p>
      {hint ? (
        <p className="mt-2 text-caption text-foreground-subtle">{hint}</p>
      ) : null}
    </Card>
  );
}
