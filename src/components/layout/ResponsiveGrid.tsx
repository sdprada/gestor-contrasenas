import * as React from "react";
import { cn } from "@/lib/utils";

type ColumnsAtBreakpoint = 1 | 2 | 3 | 4 | 5 | 6;

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Columns at the smallest viewport. */
  base?: ColumnsAtBreakpoint;
  sm?: ColumnsAtBreakpoint;
  md?: ColumnsAtBreakpoint;
  lg?: ColumnsAtBreakpoint;
  xl?: ColumnsAtBreakpoint;
  /** Tailwind gap utility, defaults to gap-4. */
  gap?: "sm" | "md" | "lg";
}

const COLS_BASE: Record<ColumnsAtBreakpoint, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};
const COLS_SM: Record<ColumnsAtBreakpoint, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};
const COLS_MD: Record<ColumnsAtBreakpoint, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};
const COLS_LG: Record<ColumnsAtBreakpoint, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};
const COLS_XL: Record<ColumnsAtBreakpoint, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
};

const GAP = { sm: "gap-3", md: "gap-4", lg: "gap-6" } as const;

/**
 * ResponsiveGrid — declarative grid with semantic breakpoint props.
 *
 * Replaces the repeated `grid gap-4 sm:grid-cols-2 lg:grid-cols-4` style
 * boilerplate. Tailwind classes are mapped statically so JIT picks them up.
 */
export const ResponsiveGrid = React.forwardRef<
  HTMLDivElement,
  ResponsiveGridProps
>(
  (
    { base = 1, sm, md, lg, xl, gap = "md", className, ...rest },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "grid",
        GAP[gap],
        COLS_BASE[base],
        sm && COLS_SM[sm],
        md && COLS_MD[md],
        lg && COLS_LG[lg],
        xl && COLS_XL[xl],
        className,
      )}
      {...rest}
    />
  ),
);
ResponsiveGrid.displayName = "ResponsiveGrid";
