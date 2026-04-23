"use client";

import { useEffect, useMemo, useState } from "react";
import { Reminder, ReminderStatus } from "@/lib/types/reminder";
import {useReminder} from "@/app/context/ReminderContext";
import { useTenant } from "@/app/context/ApiContext";

const statusOptions: Array<{ value: ReminderStatus | "all"; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
];

export function ReminderPage() {
  const { tenants } = useTenant();
  const{reminders, loading, error, fetchReminders}=useReminder();

  const [status, setStatus] = useState<ReminderStatus | "all">("all");
  const [tenantId, setTenantId] = useState("all");
  const [date, setDate] = useState("");

useEffect(() => {
  fetchReminders({
    status,
    tenantId,
    startDate: date || undefined,
    endDate: date || undefined,
  });
}, [status, tenantId, date, fetchReminders]);


  const statusPillClass = (value: ReminderStatus) => {
    if (value === "sent") return "bg-green-100 text-green-700";
    if (value === "failed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const sortedRows = useMemo(
    () =>
      [...reminders].sort((a, b) => {
        const aDate = new Date(a.sentAt || a.createdAt || 0).getTime();
        const bDate = new Date(b.sentAt || b.createdAt || 0).getTime();
        return bDate - aDate;
      }),
    [reminders]
  );

  return (
    <div className="p-6 md:p-8 space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reminders</h1>
        <p className="mt-1 text-sm text-gray-600">Track and filter sent rent reminders.</p>
      </header>

      <section className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-4">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as ReminderStatus | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={tenantId}
          onChange={(event) => setTenantId(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="all">All Tenants</option>
          {tenants.map((tenant) => (
            <option key={tenant.id || tenant._id} value={tenant.id || tenant._id}>
              {tenant.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />

        <button
          onClick={() => {
            setStatus("all");
            setTenantId("all");
            setDate("");
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Tenant Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Months</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Sent Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-600" colSpan={5}>
                  Loading reminders...
                </td>
              </tr>
            ) : sortedRows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-600" colSpan={5}>
                  No reminders found.
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => (
                <tr key={row.id || row._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm text-gray-900">{row.tenantName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">₹{row.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.months}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusPillClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {row.sentAt || row.createdAt
                      ? new Date(row.sentAt || row.createdAt || "").toLocaleString("en-IN")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
