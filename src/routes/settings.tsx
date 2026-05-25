import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageStack } from "@/components/layout/PageContainer";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SettingsRow } from "@/components/shared/SettingsRow";
import { useUiStore } from "@/stores/useUiStore";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Ajustes · Guardián de Contraseñas" },
      {
        name: "description",
        content: "Configura tema, notificaciones y preferencias de seguridad.",
      },
    ],
  }),
  component: Settings,
});

const NAV = [
  ["Apariencia", "#appearance"],
  ["Seguridad", "#security"],
  ["Notificaciones", "#notifications"],
  ["Acerca de", "#about"],
] as const;

function Settings() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const [notif, setNotif] = useState(true);
  const [autolock, setAutolock] = useState(false);
  const [biometric, setBiometric] = useState(true);

  return (
    <PageStack>
      <PageHeader
        title="Ajustes"
        description="Configura tu experiencia y la seguridad de tu bóveda."
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="flex flex-col gap-1">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-label text-foreground-muted transition-standard hover:bg-surface-muted hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-6">
          <Card id="appearance" padding="lg">
            <SectionContainer
              title="Apariencia"
              description="Personaliza el tema visual."
            >
              <div className="divide-y divide-border">
                <SettingsRow
                  label="Modo oscuro"
                  description="Reduce la fatiga visual en sesiones largas."
                  checked={theme === "dark"}
                  onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                />
              </div>
            </SectionContainer>
          </Card>

          <Card id="security" padding="lg">
            <SectionContainer
              title="Seguridad"
              description="Protege tu bóveda con capas adicionales."
            >
              <div className="divide-y divide-border">
                <SettingsRow
                  label="Bloqueo automático"
                  description="Bloquea la bóveda tras 5 minutos de inactividad."
                  checked={autolock}
                  onCheckedChange={setAutolock}
                />
                <SettingsRow
                  label="Huella digital"
                  description="Usa biometría para desbloquear (cuando esté disponible)."
                  checked={biometric}
                  onCheckedChange={setBiometric}
                />
              </div>
            </SectionContainer>
          </Card>

          <Card id="notifications" padding="lg">
            <SectionContainer
              title="Notificaciones"
              description="Recordatorios de seguridad y logros."
            >
              <div className="divide-y divide-border">
                <SettingsRow
                  label="Notificaciones push"
                  description="Recordatorios para revisar contraseñas débiles."
                  checked={notif}
                  onCheckedChange={setNotif}
                />
              </div>
            </SectionContainer>
          </Card>

          <Card id="about" padding="lg">
            <SectionContainer title="Acerca de">
              <p className="text-body-sm text-foreground-muted">
                Guardián de Contraseñas — versión web 1.0.0
              </p>
              <p className="text-body-sm text-foreground-muted">
                Tu mascota digital protege tus credenciales con gamificación
                divertida.
              </p>
            </SectionContainer>
          </Card>
        </div>
      </div>
    </PageStack>
  );
}
