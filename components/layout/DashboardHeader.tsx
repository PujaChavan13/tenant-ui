"use client";

import { Moon, Sun, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  className?: string;
};

export function DashboardHeader({
  title = "Rent Management",
  subtitle,
  className,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur-md transition-colors md:px-6",
        className
      )}
    >
      <div className="min-w-0 pl-12 md:pl-0">
        <h2 className="truncate text-lg font-semibold text-foreground md:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          aria-label="Toggle theme"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
        >
          {!isClient ? (
            <Sun className="size-4 opacity-0" />
          ) : resolvedTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <div className="hidden items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 sm:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            <User className="size-4" />
          </div>
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.name ?? "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-destructive"
          onClick={() => logout("manual")}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      {/* Mobile profile chip */}
      <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 sm:hidden">
        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-sm font-bold text-primary">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {user?.name ?? "Admin"}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </header>
  );
}
