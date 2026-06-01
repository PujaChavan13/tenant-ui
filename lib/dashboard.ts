import type { TenantReminderStatus } from "@/lib/types/reminder";

export type DashboardStats = {
  totalTenants: number;
  pendingReminders: number;
  sentReminders: number;
};

/**
 * Derive dashboard counts from tenant list length and reminder status rows.
 */
export function computeDashboardStats(
  totalTenants: number,
  tenantStatus: TenantReminderStatus[]
): DashboardStats {
  const pendingReminders = tenantStatus.filter((row) => row.status === "pending").length;
  const sentReminders = tenantStatus.filter((row) => row.status === "sent").length;

  return {
    totalTenants,
    pendingReminders,
    sentReminders,
  };
}
