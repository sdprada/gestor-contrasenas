/**
 * Design tokens — programmatic source of truth.
 *
 * The visual values live in `src/styles.css` as CSS custom properties.
 * This file exposes the same scales to TypeScript so charts, motion code,
 * and shared variants stay in sync with Tailwind utilities.
 *
 * Rule: never hardcode hex / oklch values in components. Use a Tailwind
 * semantic class (e.g. `bg-primary`, `text-foreground-muted`) or import
 * a token from this module.
 */

export const radius = {
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
} as const;

/** 4px-based spacing scale, aligned with Tailwind defaults. */
export const spacing = {
  px: "1px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const shadow = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  glowPrimary: "var(--shadow-glow-primary)",
  celebrate: "var(--shadow-celebrate)",
} as const;

export const breakpoint = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

/** Standard motion durations (ms). */
export const duration = {
  instant: 100,
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
} as const;

/** Standard easings — keep transitions consistent across components. */
export const easing = {
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  emphasized: "cubic-bezier(0.3, 0, 0, 1)",
  decelerate: "cubic-bezier(0, 0, 0, 1)",
} as const;

/** Chart palette — references CSS vars so it follows light/dark themes. */
export const chartPalette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

export type Radius = keyof typeof radius;
export type Shadow = keyof typeof shadow;
export type Breakpoint = keyof typeof breakpoint;
