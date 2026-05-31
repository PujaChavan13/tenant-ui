import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatWidgetProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  accentClassName?: string;
  loading?: boolean;
  onClick?: () => void;
};

export function StatWidget({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  accentClassName,
  loading = false,
  onClick,
}: StatWidgetProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.99]",
        accentClassName
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-[0.12] transition-transform duration-300 group-hover:scale-110"
        style={{ background: "var(--primary)" }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <div className="mt-3 flex h-9 items-center">
              <Loader2 className="size-7 animate-spin text-primary" aria-label="Loading" />
            </div>
          ) : (
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground tabular-nums">
              {value}
            </p>
          )}
          {description ? (
            <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors",
            iconClassName
          )}
        >
          <Icon className="size-6" aria-hidden />
        </div>
      </div>
    </Wrapper>
  );
}
