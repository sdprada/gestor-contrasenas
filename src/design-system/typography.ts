/**
 * Typography scale.
 *
 * Use the corresponding Tailwind utility classes defined in `styles.css`
 * (e.g. `.text-display`, `.text-h1`) so every screen renders the same
 * size / weight / tracking. These constants exist for headless consumers
 * (e.g. canvas rendering, generated PDFs) that need raw values.
 */

export const fontFamily = {
  sans: "var(--font-sans)",
  mono: "var(--font-mono)",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const typography = {
  display: { size: "2.5rem", line: "1.1", weight: 800, tracking: "-0.02em" },
  h1: { size: "1.875rem", line: "1.2", weight: 700, tracking: "-0.015em" },
  h2: { size: "1.5rem", line: "1.25", weight: 700, tracking: "-0.01em" },
  h3: { size: "1.125rem", line: "1.3", weight: 600, tracking: "-0.005em" },
  body: { size: "0.9375rem", line: "1.55", weight: 400, tracking: "0" },
  bodySm: { size: "0.875rem", line: "1.5", weight: 400, tracking: "0" },
  label: { size: "0.8125rem", line: "1.3", weight: 500, tracking: "0" },
  caption: { size: "0.75rem", line: "1.35", weight: 400, tracking: "0" },
  overline: {
    size: "0.6875rem",
    line: "1.2",
    weight: 600,
    tracking: "0.08em",
  },
} as const;

export type TypographyToken = keyof typeof typography;
