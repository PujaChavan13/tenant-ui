"use client";

import { useEffect, useMemo } from "react";
import { Users, BellRing, CheckCircle2 } from "lucide-react";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { computeDashboardStats } from "@/lib/dashboard";
import { useTenant } from "@/app/context/ApiContext";
import { useReminder } from "@/app/context/ReminderContext";

type DashboardPageProps = {
  onNavigate?: (pageId: string) => void;
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { tenants, loading: tenantsLoading, error: tenantsError } = useTenant();
  const {
    tenantStatus,
    loading: remindersLoading,
    error: remindersError,
    fetchTenantReminderStatus,
  } = useReminder();

  useEffect(() => {
    fetchTenantReminderStatus();
  }, [fetchTenantReminderStatus]);

  const stats = useMemo(
    () => computeDashboardStats(tenants.length, tenantStatus),
    [tenants.length, tenantStatus]
  );

  const loading = tenantsLoading || remindersLoading;
  const error = tenantsError || remindersError;

  return (
    <div className="space-y-8 p-6 md:p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Overview of tenants and rent reminders at a glance.
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatWidget
            title="Total tenants"
            value={stats.totalTenants}
            description="Active tenant records in the system"
            icon={Users}
            iconClassName="bg-primary/15 text-primary"
            loading={loading}
            onClick={onNavigate ? () => onNavigate("tenants") : undefined}
          />
          <StatWidget
            title="Pending reminders"
            value={stats.pendingReminders}
            description="Tenants with outstanding rent reminders"
            icon={BellRing}
            iconClassName="bg-amber-500/15 text-amber-600 dark:text-amber-400"
            loading={loading}
            onClick={onNavigate ? () => onNavigate("reminders") : undefined}
          />
          <StatWidget
            title="Reminders sent"
            value={stats.sentReminders}
            description="Tenants with reminders already sent"
            icon={CheckCircle2}
            iconClassName="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            loading={loading}
            onClick={onNavigate ? () => onNavigate("reminders") : undefined}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jump to common tasks from your dashboard.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate?.("tenants")}
            className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Manage tenants
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("reminders")}
            className="rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View reminders
          </button>
        </div>
      </section>
    </div>
  );
}
