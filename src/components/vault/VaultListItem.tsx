import { Link, useRouterState } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { PasswordEntry } from "@/stores/useVaultStore";
import { useVaultStore } from "@/stores/useVaultStore";
import { getServiceInfo } from "@/lib/services";
import { scoreStrength } from "@/lib/strength";
import { cn } from "@/lib/utils";

export function VaultListItem({ entry }: { entry: PasswordEntry }) {
  const svc = getServiceInfo(entry.service);
  const Icon = svc.icon;
  const toggleFavorite = useVaultStore((s) => s.toggleFavorite);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const active = path === `/vault/${entry.id}`;
  const score = scoreStrength(entry.password);

  return (
    <Link
      to="/vault/$id"
      params={{ id: entry.id }}
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-surface-muted",
        active && "border-border bg-surface-muted",
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md text-white",
          svc.color,
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{entry.name}</p>
          <span
            className={cn(
              "size-1.5 rounded-full",
              score >= 3
                ? "bg-success"
                : score >= 2
                  ? "bg-warning"
                  : "bg-destructive",
            )}
            aria-hidden
          />
        </div>
        <p className="truncate text-xs text-foreground-muted">
          {entry.username}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(entry.id);
        }}
        className="text-foreground-subtle hover:text-accent-amber"
        aria-label={entry.favorite ? "Quitar favorito" : "Marcar favorito"}
      >
        <Star
          className={cn(
            "size-4",
            entry.favorite && "fill-accent-amber text-accent-amber",
          )}
        />
      </button>
    </Link>
  );
}
