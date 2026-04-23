export type ReminderStatus = "pending" | "sent" | "failed";

export interface Reminder {
  id?: string;
  _id?: string;
  tenantId: string;
  tenantName: string;
  contact: string;
  amount: number;
  months: number;
  message: string;
  status: ReminderStatus;
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReminderFilters {
  status?: ReminderStatus | "all";
  tenantId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReminderResponse {
  success: boolean;
  data?: Reminder;
  message?: string;
  error?: string;
}
