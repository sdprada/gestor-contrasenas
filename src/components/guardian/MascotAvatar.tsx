import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SIZES = { xs: 32, sm: 48, md: 96, lg: 160, xl: 240 } as const;

export function MascotAvatar({
  size = "md",
  level,
  className,
  animate = true,
}: {
  size?: keyof typeof SIZES;
  level?: number;
  className?: string;
  animate?: boolean;
}) {
  const px = SIZES[size];
  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: px, height: px }}
      role="img"
      aria-label={level ? `Gato guardián nivel ${level}` : "Gato guardián"}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="size-full drop-shadow-sm"
        animate={animate ? { y: [0, -3, 0] } : undefined}
        transition={
          animate
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      >
        <defs>
          <radialGradient id="catBg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="oklch(0.95 0.04 295)" />
            <stop offset="100%" stopColor="oklch(0.85 0.06 295)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#catBg)" />
        {/* Ears */}
        <path
          d="M22 36 L30 18 L42 32 Z"
          fill="oklch(0.55 0.2 295)"
        />
        <path
          d="M78 36 L70 18 L58 32 Z"
          fill="oklch(0.55 0.2 295)"
        />
        <path
          d="M28 32 L32 24 L38 32 Z"
          fill="oklch(0.7 0.18 50)"
        />
        <path
          d="M72 32 L68 24 L62 32 Z"
          fill="oklch(0.7 0.18 50)"
        />
        {/* Face */}
        <ellipse cx="50" cy="56" rx="30" ry="28" fill="oklch(0.99 0.01 280)" />
        {/* Eyes */}
        <circle cx="40" cy="54" r="3.5" fill="oklch(0.2 0.03 270)" />
        <circle cx="60" cy="54" r="3.5" fill="oklch(0.2 0.03 270)" />
        <circle cx="41" cy="53" r="1" fill="white" />
        <circle cx="61" cy="53" r="1" fill="white" />
        {/* Nose + mouth */}
        <path
          d="M48 64 Q50 66 52 64 L50 67 Z"
          fill="oklch(0.65 0.22 350)"
        />
        <path
          d="M50 67 Q46 71 43 69 M50 67 Q54 71 57 69"
          stroke="oklch(0.2 0.03 270)"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Whiskers */}
        <path
          d="M32 62 L20 60 M32 65 L20 67 M68 62 L80 60 M68 65 L80 67"
          stroke="oklch(0.48 0.025 270)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </motion.svg>
      {level !== undefined && (
        <span
          className={cn(
            "absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full border-2 border-background bg-primary font-bold text-primary-foreground tabular",
            size === "xs" && "size-4 text-[8px] border",
            size === "sm" && "size-5 text-[9px]",
            size === "md" && "size-7 text-xs",
            size === "lg" && "size-10 text-sm",
            size === "xl" && "size-14 text-base",
          )}
        >
          {level}
        </span>
      )}
    </div>
  );
}
