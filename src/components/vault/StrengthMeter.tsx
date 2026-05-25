import { cn } from "@/lib/utils";
import { scoreStrength, strengthLabel } from "@/lib/strength";

export function StrengthMeter({
  password,
  showLabel = true,
  className,
}: {
  password: string;
  showLabel?: boolean;
  className?: string;
}) {
  const score = scoreStrength(password);
  const fillColor =
    score <= 1
      ? "bg-destructive"
      : score === 2
        ? "bg-warning"
        : "bg-success";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < score ? fillColor : "bg-muted",
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="w-16 text-right text-xs font-medium text-foreground-muted">
          {strengthLabel(score)}
        </span>
      )}
    </div>
  );
}
