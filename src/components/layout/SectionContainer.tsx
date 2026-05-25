import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

/**
 * SectionContainer — semantic `<section>` with optional header.
 *
 * Header layout (title + description + right-aligned actions) matches
 * `PageHeader` at a smaller scale. Use inside dashboard panels for
 * consistent inner spacing.
 */
export const SectionContainer = React.forwardRef<
  HTMLElement,
  SectionContainerProps
>(({ title, description, actions, className, children, ...rest }, ref) => (
  <section
    ref={ref}
    className={cn("flex flex-col gap-4", className)}
    {...rest}
  >
    {(title || actions) && (
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {title ? <h2 className="text-h3 text-foreground">{title}</h2> : null}
          {description ? (
            <p className="mt-0.5 text-body-sm text-foreground-muted">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>
    )}
    {children}
  </section>
));
SectionContainer.displayName = "SectionContainer";
