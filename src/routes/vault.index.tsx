import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/useUiStore";
import { MascotAvatar } from "@/components/guardian/MascotAvatar";

export const Route = createFileRoute("/vault/")({
  component: VaultEmpty,
});

function VaultEmpty() {
  const openAdd = useUiStore((s) => s.openAdd);
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <MascotAvatar size="md" />
      <div>
        <h2 className="text-h3 text-foreground">Selecciona una contraseña</h2>
        <p className="mt-1 text-body-sm text-foreground-muted">
          Elige una entrada de la lista o crea una nueva.
        </p>
      </div>
      <Button onClick={openAdd} variant="xp">
        <KeyRound className="size-4" /> Nueva contraseña
      </Button>
    </div>
  );
}
