"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Tenant } from "@/lib/types/tenant";
import{useReminder} from "@/app/context/ReminderContext";

interface ReminderModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onSuccess?: () => Promise<void> | void;
}

const clampMonths = (value: number) => Math.max(1, Math.min(24, Math.floor(value || 1)));

export function ReminderModal({ isOpen, tenant, onClose, onSuccess }: ReminderModalProps) {
  const [pendingMonths, setPendingMonths] = useState(1);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const monthlyRent = Number(tenant?.monthlyRent ?? tenant?.rent ?? 0);
  const totalAmount = useMemo(() => monthlyRent * pendingMonths, [monthlyRent, pendingMonths]);

  const defaultMessage = useMemo(() => {
    if (!tenant?.name) return "";
    return `Hello ${tenant.name}, your rent for ${pendingMonths} month${pendingMonths > 1 ? "s" : ""} is pending. Total amount: ₹${totalAmount}. Please pay soon.`;
  }, [tenant?.name, pendingMonths, totalAmount]);

  useEffect(() => {
    if (!isOpen || !tenant) return;
    setPendingMonths(1);
    setContact(tenant.contactNumber || "");
    setMessage(
      `Hello ${tenant.name}, your rent for 1 month is pending. Total amount: ₹${monthlyRent}. Please pay soon.`
    );
    setToast(null);
  }, [isOpen, tenant, monthlyRent]);

  useEffect(() => {
    if (!isOpen) return;
    setMessage(defaultMessage);
  }, [defaultMessage, isOpen]);

    const { sendReminder } = useReminder();
  const handleSend = async () => {
    if (!tenant) return;

    try {
      setIsSending(true);
      setToast(null);
      await sendReminder({
        tenantId: tenant.id || tenant._id || "",
        tenantName: tenant.name,
        contact,
        amount: totalAmount,
        months: pendingMonths,
        message,
      });
      setToast({ type: "success", text: "Reminder sent successfully." });
      await onSuccess?.();
      window.setTimeout(() => onClose(), 700);
    } catch (error) {
      setToast({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to send reminder.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Send Rent Reminder" maxWidth="max-w-xl">
      {!tenant ? null : (
        <div className="space-y-4">
          {toast ? (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                toast.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {toast.text}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Tenant Name</span>
              <input
                value={tenant.name}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Contact Number</span>
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Monthly Rent</span>
              <input
                value={`₹${monthlyRent}`}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Pending Months</span>
              <input
                type="number"
                min={1}
                max={24}
                value={pendingMonths}
                onChange={(event) => setPendingMonths(clampMonths(Number(event.target.value)))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="rounded-md border border-blue-100 bg-blue-50 p-3">
            <p className="text-sm font-semibold text-blue-900">Total Amount: ₹{totalAmount}</p>
          </div>

          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Message Preview</span>
            <textarea
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !contact}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending..." : "Send Reminder"}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
