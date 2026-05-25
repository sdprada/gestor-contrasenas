# Design System

Single source of truth for visual decisions in this app.

## Structure

- `styles.css` — CSS custom properties (colors, radii, shadows, gradients)
  and Tailwind v4 `@utility` declarations (typography scale, panel, page
  containers, surface tones).
- `design-system/tokens.ts` — TypeScript mirror of the same tokens, for
  use in charts and generated assets.
- `design-system/typography.ts` — typography scale primitives.

## Rules

1. **No hardcoded color values in components.** Use a semantic Tailwind
   class (`bg-primary`, `text-foreground-muted`, `border-border`) or one
   of the surface-tone utilities (`tone-success`, `tone-amber`, etc.).
2. **No hardcoded spacing values.** Stick to the Tailwind 4px scale.
3. **No ad-hoc shadows.** Use `shadow-xs / sm / md / lg / xl` or one of
   the named gradients (`shadow-celebrate`, `shadow-glow-primary`).
4. **Typography uses the scale.** Apply `text-display`, `text-h1`,
   `text-h2`, `text-h3`, `text-body`, `text-body-sm`, `text-label`,
   `text-caption`, `text-overline` instead of building font-size +
   weight + tracking by hand.
5. **Layout uses primitives.** Reach for `<PageContainer>`,
   `<PageHeader>`, `<SectionContainer>`, `<ResponsiveGrid>`,
   `<Panel>`, `<StatCard>` before writing a one-off `<div>`.
6. **Interactive surfaces use `Card variant="interactive"`** (or the
   `card-interactive` utility) so hover + focus states stay uniform.

## Component variants

- `<Button variant="xp">` — gradient primary CTA used for level-up /
  primary creation actions.
- `<Card variant="muted | interactive | gradient">` — semantic surfaces.
- `<Card padding="none | sm | md | lg">` — control internal spacing.
