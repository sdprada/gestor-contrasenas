import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PageContainer — outer page padding + max-width.
 *
 * Use inside a route component (the AppShell already mounts this once
 * around `<Outlet />`, so most routes won't need it). Exposed for routes
 * that want to break out (e.g. full-bleed hero) and re-enter the grid.
 */
export const PageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mx-auto w-full max-w-[1600px]", className)}
    {...props}
  />
));
PageContainer.displayName = "PageContainer";

/**
 * PageStack — vertical rhythm for top-level page sections.
 *
 * Default gap matches the visual density used across Dashboard / Vault /
 * Achievements / Settings. Use `tight` for denser dashboards.
 */
export const PageStack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { density?: "default" | "tight" }
>(({ className, density = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col",
      density === "default" ? "gap-6 lg:gap-8" : "gap-4 lg:gap-6",
      className,
    )}
    {...props}
  />
));
PageStack.displayName = "PageStack";
