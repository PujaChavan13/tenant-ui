"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Loader2 } from "lucide-react";
import { TenantReminderStatus } from "@/lib/types/reminder";
import { formatReminderCountdown, isReminderBlocked } from "@/lib/reminderUtils";
import { useReminder } from "@/app/context/ReminderContext";

export function ReminderPage() {
  // const [rows, setRows] = useState<TenantReminderStatus[]>([]);
  const [activeTab, setActiveTab] = useState<"sent" | "pending">("pending");
  const [sendingTenantId, setSendingTenantId] = useState<string | null>(null);
  const [tick, setTick] = useState(Date.now());
  const{sendReminder,tenantStatus,fetchTenantReminderStatus,loading,error}=useReminder();
  const  rows= tenantStatus;
  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getTenantReminderStatus();
  //     setRows(data);
  //   } catch (fetchError) {
  //     setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch reminder status.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchTenantReminderStatus();
  }, [fetchTenantReminderStatus]);

  const filteredRows = useMemo(() => {
    const base = rows.filter((row) => row.status === activeTab);
    if (activeTab === "pending") {
      return [...base].sort((a, b) => b.pendingAmount - a.pendingAmount);
    }
    return base;
  }, [rows, activeTab]);

  const sentCount = useMemo(() => rows.filter((item) => item.status === "sent").length, [rows]);
  const pendingCount = useMemo(() => rows.filter((item) => item.status === "pending").length, [rows]);

  const statusPillClass = (value: "sent" | "pending") =>
    value === "sent" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";

  const handleSendReminder = async (row: TenantReminderStatus) => {
    if (isReminderBlocked(row.lastReminderSentAt)) return;

    try {
      setSendingTenantId(row.tenantId);
      await sendReminder({
        tenantId: row.tenantId,
        tenantName: row.tenantName,
        contact: row.contactNumber,
        amount: row.pendingAmount,
        months: row.pendingMonths,
        message: `Hello ${row.tenantName}, your rent for ${row.pendingMonths} month${row.pendingMonths > 1 ? "s" : ""} is pending. Total amount: ₹${row.pendingAmount}. Please pay soon.`,
      });
  
    } catch (err) {
      console.error("Send reminder error:", err);
    } finally {
      setSendingTenantId(null);
    }
  };

  void tick;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reminders</h1>
        <p className="mt-1 text-sm text-gray-600">Track pending and sent reminders and trigger new sends.</p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            PENDING ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "sent" ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            SENT ({sentCount})
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[840px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Tenant Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Contact</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Rent</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Pending Months</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700">Next Window</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-600" colSpan={8}>
                  Loading reminder status...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-gray-600" colSpan={8}>
                  No records in {activeTab.toUpperCase()} tab.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const blocked = isReminderBlocked(row.lastReminderSentAt);
                const countdown = formatReminderCountdown(row.lastReminderSentAt);
                const isSending = sendingTenantId === row.tenantId;

                return (
                  <tr key={`${row.tenantId}-${row.status}`} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900">{row.tenantName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.contactNumber || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{row.monthlyRent}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{row.pendingMonths}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{row.pendingAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusPillClass(row.status)}`}>
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{blocked ? countdown : "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleSendReminder(row)}
                        disabled={blocked || isSending}
                        title={blocked ? countdown : "Send reminder"}
                        className={`inline-flex items-center justify-center rounded-md p-2 transition-colors ${
                          blocked || isSending
                            ? "opacity-50 cursor-not-allowed text-gray-400"
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BellRing className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
