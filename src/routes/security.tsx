import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Loader2, KeyRound, AlertTriangle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageStack } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid";
import { useAuthStore } from "@/stores/useAuthStore";
import { apiResumen } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/security")({
  component: SecurityPage,
});

type Resumen = {
  total: number;
  seguridad: { FUERTE: number; MEDIA: number; DEBIL: number };
  caducidad: { VIGENTE: number; POR_VENCER: number; VENCIDA: number; SIN_FECHA: number };
};

function SecurityPage() {
  const user = useAuthStore((s) => s.user);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiResumen(user.nombre_usuario);
      setResumen(data);
    } catch {
      toast.error("Error al cargar resumen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [user]);

  return (
    <PageStack>
      <PageHeader title="Resumen de seguridad" description="Estado general de tus contraseñas y caducidad." />
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-foreground-muted">
          <Loader2 className="size-4 animate-spin" />
          Cargando...
        </div>
      )}
      {!loading && resumen && (
        <>
          <ResponsiveGrid base={1} sm={2} lg={4} gap="md">
            <StatCard label="Total" value={resumen.total} icon={KeyRound} tone="primary" />
            <StatCard label="Fuertes" value={resumen.seguridad.FUERTE} icon={ShieldCheck} tone="success" />
            <StatCard label="Medias" value={resumen.seguridad.MEDIA} icon={Clock} tone="warning" />
            <StatCard label="Débiles" value={resumen.seguridad.DEBIL} icon={AlertTriangle} tone="destructive" />
          </ResponsiveGrid>

          <Card padding="lg">
            <h3 className="mb-4 text-lg font-semibold">Caducidad</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Vigentes", value: resumen.caducidad.VIGENTE, tone: "success" },
                { label: "Por vencer", value: resumen.caducidad.POR_VENCER, tone: "warning" },
                { label: "Vencidas", value: resumen.caducidad.VENCIDA, tone: "destructive" },
                { label: "Sin fecha", value: resumen.caducidad.SIN_FECHA, tone: "muted" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg border p-4",
                    item.tone === "success" && "border-success/30 bg-success/10",
                    item.tone === "warning" && "border-warning/30 bg-warning/10",
                    item.tone === "destructive" && "border-destructive/30 bg-destructive/10",
                    item.tone === "muted" && "border-border bg-surface",
                  )}
                >
                  <span className="text-2xl font-bold text-foreground">{item.value}</span>
                  <span className="text-xs text-foreground-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </PageStack>
  );
}
