import { Reminder, ReminderFilters, ReminderResponse } from "@/lib/types/reminder";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const REMINDERS_ENDPOINT = `${API_BASE_URL}/reminders`;

type ApiReminder = Partial<Reminder> & {
  _id?: string;
  id?: string;
};

function normalizeReminder(reminder: ApiReminder): Reminder {
  return {
    id: reminder.id ?? reminder._id ?? "",
    _id: reminder._id,
    tenantId: reminder.tenantId ?? "",
    tenantName: reminder.tenantName ?? "",
    contact: reminder.contact ?? "",
    amount: Number(reminder.amount ?? 0),
    months: Number(reminder.months ?? 0),
    message: reminder.message ?? "",
    status: (reminder.status ?? "pending") as Reminder["status"],
    sentAt: reminder.sentAt,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  };
}

function createQueryString(filters?: ReminderFilters): string {
  if (!filters) return "";

  const query = new URLSearchParams();
  if (filters.status && filters.status !== "all") query.set("status", filters.status);
  if (filters.tenantId && filters.tenantId !== "all") query.set("tenantId", filters.tenantId);
  if (filters.startDate) query.set("startDate", filters.startDate);
  if (filters.endDate) query.set("endDate", filters.endDate);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function createReminder(payload: {
  tenantId: string;
  tenantName: string;
  contact: string;
  amount: number;
  months: number;
  message: string;
}): Promise<ReminderResponse> {
  const response = await fetch(REMINDERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to create reminder");
  }

  return {
    ...data,
    data: data?.data ? normalizeReminder(data.data) : undefined,
  };
}

export async function getReminders(filters?: ReminderFilters): Promise<Reminder[]> {
  const response = await fetch(`${REMINDERS_ENDPOINT}${createQueryString(filters)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch reminders");
  }

  const reminders = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return reminders.map(normalizeReminder);
}

export async function getRemindersByTenant(tenantId: string): Promise<Reminder[]> {
  const response = await fetch(`${REMINDERS_ENDPOINT}/${tenantId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Failed to fetch tenant reminders");
  }

  const reminders = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return reminders.map(normalizeReminder);
}
