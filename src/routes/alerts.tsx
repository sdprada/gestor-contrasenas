import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageStack } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiAlertas, apiMarcarAlerta } from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  component: AlertsPage,
});

type Alert = {
  id: number;
  tipo: string;
  mensaje: string;
  leida: number;
  fecha: string;
};

function AlertsPage() {
  const user = useAuthStore((s) => s.user);
  const [alertas, setAlertas] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiAlertas(user.nombre_usuario);
      setAlertas(data);
    } catch {
      toast.error("Error al cargar alertas");
    } finally {
      setLoading(false);
    }
  };

  const marcar = async (id: number) => {
    if (!user) return;
    try {
      await apiMarcarAlerta(id, user.nombre_usuario);
      setAlertas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, leida: 1 } : a)),
      );
      toast.success("Alerta marcada como leída");
    } catch {
      toast.error("No se pudo marcar");
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  return (
    <PageStack>
      <PageHeader title="Alertas de seguridad" description="Notificaciones automáticas sobre tus contraseñas." />
      <Card padding="lg">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-foreground-muted">
            <Loader2 className="size-4 animate-spin" />
            Cargando...
          </div>
        )}
        {!loading && alertas.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-foreground-muted">
            <Bell className="size-8" />
            <p className="text-sm">No tienes alertas.</p>
          </div>
        )}
        {!loading && (
          <div className="flex flex-col gap-3">
            {alertas.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                  a.leida
                    ? "border-border bg-surface opacity-60"
                    : "border-primary bg-primary-soft/30",
                )}
              >
                <div className="mt-0.5">
                  <Bell className={cn("size-4", a.leida ? "text-foreground-muted" : "text-primary")} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{a.tipo}</p>
                  <p className="text-sm text-foreground-muted">{a.mensaje}</p>
                  <p className="mt-1 text-xs text-foreground-subtle">
                    {format(new Date(a.fecha), "dd MMM yyyy HH:mm")}
                  </p>
                </div>
                {!a.leida && (
                  <Button size="sm" variant="ghost" onClick={() => marcar(a.id)}>
                    <Check className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageStack>
  );
}
