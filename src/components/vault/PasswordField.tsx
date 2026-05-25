import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/utils";

export function PasswordField({
  value,
  label = "Contraseña",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const copy = useClipboard();
  return (
    <div
      className={cn(
        "flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3",
        className,
      )}
    >
      <span
        className={cn(
          "flex-1 truncate font-mono text-sm",
          !revealed && "tracking-widest",
        )}
      >
        {revealed ? value : "•".repeat(Math.min(16, value.length))}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? "Ocultar" : "Revelar"}
      >
        {revealed ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => copy(value, label)}
        aria-label="Copiar"
      >
        <Copy className="size-4" />
      </Button>
    </div>
  );
}
