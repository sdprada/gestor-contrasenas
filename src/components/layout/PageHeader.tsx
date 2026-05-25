import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned slot for primary CTAs / secondary actions. */
  actions?: React.ReactNode;
  /** Optional eyebrow / breadcrumb-style label rendered above the title. */
  eyebrow?: React.ReactNode;
}

/**
 * PageHeader — title + description + optional actions.
 *
 * Standardizes the eyebrow/title/description block used at the top of
 * every route so spacing, typography, and alignment stay identical.
 */
export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, eyebrow, className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end",
        className,
      )}
      {...rest}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-overline text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="text-h1 text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-body-sm text-foreground-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  ),
);
PageHeader.displayName = "PageHeader";
