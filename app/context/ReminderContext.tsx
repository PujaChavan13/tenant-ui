"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { Reminder, ReminderFilters } from "@/lib/types/reminder";
import {
  createReminder,
  getReminders,
  getRemindersByTenant,
} from "@/app/services/reminderService";

type ReminderContextType = {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;

  fetchReminders: (filters?: ReminderFilters) => Promise<void>;
  fetchRemindersByTenant: (tenantId: string) => Promise<void>;
  sendReminder: (data: {
    tenantId: string;
    tenantName: string;
    contact: string;
    amount: number;
    months: number;
    message: string;
  }) => Promise<Reminder | null>;
};

const ReminderContext = createContext<ReminderContextType | undefined>(
  undefined
);

export const ReminderProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch all reminders
  const fetchReminders = useCallback(async (filters?: ReminderFilters) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getReminders(filters);
      setReminders(data);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch reminders";
      setError(errorMsg);
      console.error("Fetch reminders error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch reminders by tenant
  const fetchRemindersByTenant = useCallback(async (tenantId: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getRemindersByTenant(tenantId);
      setReminders(data);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to fetch tenant reminders";
      setError(errorMsg);
      console.error("Fetch tenant reminders error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Send (create) reminder
  const sendReminder = useCallback(
    async (data: {
      tenantId: string;
      tenantName: string;
      contact: string;
      amount: number;
      months: number;
      message: string;
    }) => {
      try {
        setError(null);

        const res = await createReminder(data);
        const newReminder = res?.data ?? null;

        if (newReminder) {
          setReminders((prev) => [newReminder, ...prev]);
        }

        return newReminder;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to send reminder";
        setError(errorMsg);
        console.error("Send reminder error:", err);
        throw err;
      }
    },
    []
  );

  const value: ReminderContextType = {
    reminders,
    loading,
    error,
    fetchReminders,
    fetchRemindersByTenant,
    sendReminder,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

// ✅ Custom hook
export const useReminder = (): ReminderContextType => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminder must be used within ReminderProvider");
  }
  return context;
};