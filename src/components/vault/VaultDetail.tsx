import { useNavigate } from "@tanstack/react-router";
import { Star, Trash2, Pencil, ExternalLink } from "lucide-react";
import type { PasswordEntry } from "@/stores/useVaultStore";
import { useVaultStore } from "@/stores/useVaultStore";
import { useUiStore } from "@/stores/useUiStore";
import { getServiceInfo } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { PasswordField } from "./PasswordField";
import { StrengthMeter } from "./StrengthMeter";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

export function VaultDetail({ entry }: { entry: PasswordEntry }) {
  const svc = getServiceInfo(entry.service);
  const Icon = svc.icon;
  const toggleFavorite = useVaultStore((s) => s.toggleFavorite);
  const remove = useVaultStore((s) => s.remove);
  const openEdit = useUiStore((s) => s.openEdit);
  const copy = useClipboard();
  const nav = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-md",
            svc.color,
          )}
        >
          <Icon className="size-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-h2 truncate text-foreground">{entry.name}</h2>
            <button
              onClick={() => toggleFavorite(entry.id)}
              className="text-foreground-subtle transition-standard hover:text-accent-amber"
              aria-label="Favorito"
            >
              <Star
                className={cn(
                  "size-5",
                  entry.favorite && "fill-accent-amber text-accent-amber",
                )}
              />
            </button>
          </div>
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-body-sm text-foreground-muted transition-standard hover:text-primary"
            >
              {entry.url.replace(/^https?:\/\//, "")}
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEdit(entry.id)}
          >
            <Pencil className="size-4" /> Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`¿Eliminar ${entry.name}?`)) {
                remove(entry.id);
                toast.success("Contraseña eliminada");
                nav({ to: "/vault" });
              }
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-overline text-foreground-muted">
            Usuario
          </label>
          <div className="field-row">
            <span className="flex-1 truncate text-body-sm">
              {entry.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(entry.username, "Usuario")}
            >
              Copiar
            </Button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-overline text-foreground-muted">
            Contraseña
          </label>
          <PasswordField value={entry.password} />
          <StrengthMeter password={entry.password} className="mt-2" />
        </div>
        {entry.notes && (
          <div>
            <label className="mb-1.5 block text-overline text-foreground-muted">
              Notas
            </label>
            <p className="rounded-lg border border-border bg-surface p-3 text-body-sm">
              {entry.notes}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-4 text-caption text-foreground-subtle">
        <span>Creada {format(entry.createdAt, "dd MMM yyyy")}</span>
        <span>·</span>
        <span>Actualizada {format(entry.updatedAt, "dd MMM yyyy")}</span>
      </div>
    </div>
  );
}
