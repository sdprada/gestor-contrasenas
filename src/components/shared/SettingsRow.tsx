import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SettingsRowProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Optional override for the trailing control. Defaults to a Switch when `checked` is provided. */
  control?: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

/**
 * SettingsRow — label + description on the left, control on the right.
 *
 * Used inside settings panels so every preference row shares the same
 * vertical rhythm, divider behavior, and control alignment.
 */
export function SettingsRow({
  label,
  description,
  control,
  checked,
  onCheckedChange,
  className,
}: SettingsRowProps) {
  const trailing =
    control ??
    (typeof checked === "boolean" ? (
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    ) : null);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-label text-foreground">{label}</p>
        {description ? (
          <p className="mt-0.5 text-body-sm text-foreground-muted">
            {description}
          </p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
