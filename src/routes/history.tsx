import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History, Shield, KeyRound, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageStack } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiHistorial, apiLogs } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

type HistItem = {
  accion?: string;
  id_contrasena?: number;
  detalle?: string;
  fecha: string;
  ip_address?: string;
};

function HistoryPage() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<"actions" | "logs">("actions");
  const [items, setItems] = useState<HistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data =
        tab === "actions"
          ? await apiHistorial(user.nombre_usuario)
          : await apiLogs(user.nombre_usuario);
      setItems(data);
    } catch {
      toast.error("Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user, tab]);

  const iconFor = (action?: string) => {
    if (!action) return Shield;
    if (action.includes("CREADA")) return KeyRound;
    if (action.includes("ELIMINADA")) return Trash2;
    return Shield;
  };

  return (
    <PageStack>
      <PageHeader title="Historial" description="Auditoría de acciones y accesos a tu cuenta." />
      <div className="flex gap-2">
        <button
          onClick={() => setTab("actions")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
            tab === "actions"
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-surface text-foreground-muted hover:bg-surface-muted",
          )}
        >
          Acciones
        </button>
        <button
          onClick={() => setTab("logs")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
            tab === "logs"
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-surface text-foreground-muted hover:bg-surface-muted",
          )}
        >
          Logs de acceso
        </button>
      </div>
      <Card padding="lg">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-foreground-muted">
            <Loader2 className="size-4 animate-spin" />
            Cargando...
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-foreground-muted">
            <History className="size-8" />
            <p className="text-sm">Sin registros.</p>
          </div>
        )}
        {!loading && (
          <div className="flex flex-col gap-2">
            {items.map((item, idx) => {
              const Icon = iconFor(item.accion);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <Icon className="size-4 text-foreground-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {item.accion || "Acceso"}
                    </p>
                    {item.detalle && (
                      <p className="text-xs text-foreground-muted truncate">{item.detalle}</p>
                    )}
                    {item.ip_address && (
                      <p className="text-xs text-foreground-subtle">IP: {item.ip_address}</p>
                    )}
                  </div>
                  <span className="text-xs text-foreground-subtle tabular">
                    {format(new Date(item.fecha), "dd MMM yyyy HH:mm")}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </PageStack>
  );
}
