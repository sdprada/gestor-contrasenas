import { useCallback } from "react";
import { toast } from "sonner";
import { useGamificationStore } from "@/stores/useGamificationStore";

export function useClipboard() {
  const incCopy = useGamificationStore((s) => s.incCopy);
  return useCallback(
    async (text: string, label = "Contraseña") => {
      try {
        await navigator.clipboard.writeText(text);
        incCopy();
        toast.success(`${label} copiada`, {
          description: "Se borrará del portapapeles en 30s",
        });
      } catch {
        toast.error("No se pudo copiar");
      }
    },
    [incCopy],
  );
}
