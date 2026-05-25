import { useState, useMemo, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useVaultStore } from "@/stores/useVaultStore";
import { VaultListItem } from "./VaultListItem";
import { scoreStrength } from "@/lib/strength";
import { cn } from "@/lib/utils";

type Filter = "all" | "favorites" | "weak" | "strong";

export function VaultList({ className }: { className?: string }) {
  const entries = useVaultStore((s) => s.entries);
  const loading = useVaultStore((s) => s.loading);
  const fetchEntries = useVaultStore((s) => s.fetchEntries);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filtered = useMemo(() => {
    return entries
      .filter((e) => {
        if (filter === "favorites") return e.favorite;
        if (filter === "weak") return scoreStrength(e.password) <= 1;
        if (filter === "strong") return scoreStrength(e.password) >= 3;
        return true;
      })
      .filter((e) => {
        if (!q) return true;
        const t = q.toLowerCase();
        return (
          e.name.toLowerCase().includes(t) ||
          e.username.toLowerCase().includes(t) ||
          e.url?.toLowerCase().includes(t)
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [entries, q, filter]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Todas" },
    { id: "favorites", label: "Favoritas" },
    { id: "strong", label: "Fuertes" },
    { id: "weak", label: "Débiles" },
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-subtle" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar en la bóveda…"
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === f.id
                ? "border-primary bg-primary-soft text-primary"
                : "border-border bg-surface text-foreground-muted hover:bg-surface-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto pr-1">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-foreground-muted">
            <Loader2 className="size-4 animate-spin" />
            Cargando...
          </div>
        )}
        {!loading && filtered.map((e) => (
          <VaultListItem key={e.id} entry={e} />
        ))}
        {!loading && filtered.length === 0 && (
          <p className="px-3 py-8 text-center text-sm text-foreground-muted">
            Sin resultados.
          </p>
        )}
      </div>
    </div>
  );
}
