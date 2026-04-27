"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText,Edit,Trash2,Plus,Loader,BellRing,} from "lucide-react";
import { Tenant } from "@/lib/types/tenant";
import { AddTenantModal } from "./AddTenantModal";
import { Dialog } from "@/components/ui/Dialog";
import { useTenant } from "@/app/context/ApiContext";
import { useReminder } from "@/app/context/ReminderContext";
import { ReminderModal } from "./ReminderModal";
import { Reminder } from "@/lib/types/reminder";

export function TenantsList() {
  const {  tenants,loading: isLoading,error,fetchTenants,deleteTenantById,} = useTenant();
  const { reminders, fetchReminders } = useReminder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [reminderTenant, setReminderTenant] = useState<Tenant | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const remindersByTenant = useMemo<Record<string, Reminder[]>>(() => {
    const grouped: Record<string, Reminder[]> = {};
    reminders.forEach((reminder) => {
      if (!grouped[reminder.tenantId]) grouped[reminder.tenantId] = [];
      grouped[reminder.tenantId].push(reminder);
    });
    return grouped;
  }, [reminders]);

  const remindersBlockedUntil = useMemo<Record<string, string | null>>(() => {
    const blocked: Record<string, string | null> = {};
    reminders.forEach((reminder) => {
      if (!reminder.sentAt) return;
      const sentTime = new Date(reminder.sentAt).getTime();
      if (Number.isNaN(sentTime)) return;
      const blockedUntil = new Date(sentTime + 24 * 60 * 60 * 1000);
      blocked[reminder.tenantId] = blockedUntil.toISOString();
    });
    return blocked;
  }, [reminders]);

  const refreshReminders = useCallback(async () => {
    await fetchReminders();
  }, [fetchReminders]);

  const canSendReminder = (tenantId: string): boolean => {
    const blockedUntil = remindersBlockedUntil[tenantId];
    if (!blockedUntil) return true;
    return new Date() > new Date(blockedUntil);
  };

  const getTimeUntilNextReminder = (tenantId: string): string => {
    const blockedUntil = remindersBlockedUntil[tenantId];
    if (!blockedUntil) return "";
    
    const now = new Date();
    const blockEnd = new Date(blockedUntil);
    const diffMs = blockEnd.getTime() - now.getTime();
    
    if (diffMs <= 0) return "";
    
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const minutes = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  const handleAddTenant = async () => {
    // Avoid optimistic prepend + refetch, which can briefly duplicate rows.
    await fetchTenants();
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleViewDetails = (tenant: Tenant) => {
    setViewingTenant(tenant);
    setIsDetailsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return;
    await deleteTenantById(id);
  };

  const handleOpenReminder = (tenant: Tenant) => {
    const tenantId = tenant.id || tenant._id || "";
    if (!canSendReminder(tenantId)) {
      const timeRemaining = getTimeUntilNextReminder(tenantId);
      setToastMessage(
        `Reminder already sent. You can send the next reminder after ${timeRemaining}.`
      );
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    setReminderTenant(tenant);
    setIsReminderOpen(true);
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";

    return parsed.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    if (!Number.isFinite(amount)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader size={36} className="mx-auto mb-3 sm:mb-4 animate-spin text-blue-600 sm:w-10 sm:h-10" />
          <p className="text-sm sm:text-base text-gray-600">Loading tenants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Message */}
      {toastMessage && (
        <div className="rounded-lg bg-amber-50 p-3 sm:p-4 text-xs sm:text-sm text-amber-800 border border-amber-200 flex items-start gap-2">
          <span className="flex-shrink-0 mt-0.5">⏱️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header - Responsive layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tenants List</h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Manage all your tenants and lease information
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTenant(null);
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 sm:py-2 font-medium text-white text-sm sm:text-base transition-colors hover:bg-blue-700"
        >
          <Plus size={18} className="flex-shrink-0" />
          Add Tenant
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 sm:p-4 text-xs sm:text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Tenant Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Shop No.
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Contact
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Rent
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Lease Dates
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                Last Reminder Sent
              </th>
              <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 sm:px-6 py-12">
                  <div className="text-center">
                    <FileText
                      size={40}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">No tenants found</p>
                    <button
                      onClick={() => {
                        setEditingTenant(null);
                        setIsModalOpen(true);
                      }}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Add your first tenant
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                (() => {
                  const tenantId = tenant.id || tenant._id || "";
                  const tenantReminders = remindersByTenant[tenantId] || [];
                  const latestReminder = [...tenantReminders].sort((a, b) => {
                    const aDate = new Date(a.sentAt || a.createdAt || 0).getTime();
                    const bDate = new Date(b.sentAt || b.createdAt || 0).getTime();
                    return bDate - aDate;
                  })[0];
                  const hasPendingRent = tenantReminders.some(
                    (item: Reminder) => item.status === "pending" || item.status === "failed"
                  );

                  return (
                    <tr
                      key={tenant.id || tenant._id || `${tenant.name}-${tenant.shopNumber}-${tenant.createdAt}`}
                      className={`border-b border-gray-200 transition-colors hover:bg-gray-50 ${hasPendingRent ? "bg-amber-50/60" : ""}`}
                    >
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                    {tenant.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                    {tenant.shopNumber || tenant.shopNo || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                    {tenant.contactNumber || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">
                    {formatCurrency(Number(tenant.monthlyRent ?? tenant.rent ?? 0))}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                    {formatDate(tenant.leaseStartDate || "")} -{" "}
                    {formatDate(tenant.leaseEndDate || "")}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                        {latestReminder?.sentAt
                          ? new Date(latestReminder.sentAt).toLocaleString("en-IN")
                          : "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleOpenReminder(tenant)}
                            disabled={!canSendReminder(tenantId)}
                            className={`rounded-lg p-2 transition-colors ${
                              canSendReminder(tenantId)
                                ? "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer"
                                : "text-gray-300 cursor-not-allowed opacity-50"
                            }`}
                            title={
                              canSendReminder(tenantId)
                                ? "Send Reminder"
                                : `Reminder blocked for ${getTimeUntilNextReminder(tenantId)}`
                            }
                          >
                            <BellRing size={16} className="sm:w-4.5 sm:h-4.5" />
                          </button>
                          <button
                            onClick={() => handleEditTenant(tenant)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Edit size={16} className="sm:w-4.5 sm:h-4.5" />
                          </button>
                          <button
                            onClick={() =>
                              (tenant.id || tenant._id) &&
                              handleDeleteTenant(tenant.id || tenant._id || "")
                            }
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} className="sm:w-4.5 sm:h-4.5" />
                          </button>
                          <button
                            onClick={() => handleViewDetails(tenant)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            title="View Details"
                          >
                            <FileText size={16} className="sm:w-4.5 sm:h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })()
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Shown only on mobile/tablet */}
      <div className="md:hidden space-y-3">
        {tenants.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <FileText size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-4">No tenants found</p>
            <button
              onClick={() => {
                setEditingTenant(null);
                setIsModalOpen(true);
              }}
              className="text-blue-600 hover:underline"
            >
              Add your first tenant
            </button>
          </div>
        ) : (
          tenants.map((tenant) => {
            const tenantId = tenant.id || tenant._id || "";
            const tenantReminders = remindersByTenant[tenantId] || [];
            const latestReminder = [...tenantReminders].sort((a, b) => {
              const aDate = new Date(a.sentAt || a.createdAt || 0).getTime();
              const bDate = new Date(b.sentAt || b.createdAt || 0).getTime();
              return bDate - aDate;
            })[0];
            const hasPendingRent = tenantReminders.some(
              (item: Reminder) => item.status === "pending" || item.status === "failed"
            );

            return (
              <div
              key={tenant.id || tenant._id || `${tenant.name}-${tenant.shopNumber}-${tenant.createdAt}`}
              className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow ${hasPendingRent ? "ring-1 ring-amber-200 bg-amber-50/50" : ""}`}
            >
              {/* Tenant name and shop */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {tenant.name}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    Shop #{tenant.shopNumber || tenant.shopNo || "-"}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleOpenReminder(tenant)}
                    disabled={!canSendReminder(tenantId)}
                    className={`rounded p-1.5 transition-colors ${
                      canSendReminder(tenantId)
                        ? "text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer"
                        : "text-gray-300 cursor-not-allowed opacity-50"
                    }`}
                    title={
                      canSendReminder(tenantId)
                        ? "Send Reminder"
                        : `Reminder blocked for ${getTimeUntilNextReminder(tenantId)}`
                    }
                  >
                    <BellRing size={16} />
                  </button>
                  <button
                    onClick={() => handleEditTenant(tenant)}
                    className="rounded p-1.5 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() =>
                      (tenant.id || tenant._id) &&
                      handleDeleteTenant(tenant.id || tenant._id || "")
                    }
                    className="rounded p-1.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => handleViewDetails(tenant)}
                    className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    title="View Details"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                <div>
                  <p className="text-xs font-medium text-gray-600">Contact</p>
                  <p className="text-xs text-gray-900 font-medium truncate">
                    {tenant.contactNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600">Monthly Rent</p>
                  <p className="text-xs text-gray-900 font-medium">
                    {formatCurrency(Number(tenant.monthlyRent ?? tenant.rent ?? 0))}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-600">Lease Period</p>
                  <p className="text-xs text-gray-900">
                    {formatDate(tenant.leaseStartDate || "")} to{" "}
                    {formatDate(tenant.leaseEndDate || "")}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-600">Last Reminder Sent</p>
                  <p className="text-xs text-gray-900">
                    {latestReminder?.sentAt
                      ? new Date(latestReminder.sentAt).toLocaleString("en-IN")
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <AddTenantModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleAddTenant}
        editingTenant={editingTenant}
      />

      <ReminderModal
        isOpen={isReminderOpen}
        tenant={reminderTenant}
        onClose={() => {
          setIsReminderOpen(false);
          setReminderTenant(null);
        }}
        onSuccess={async () => {
          await refreshReminders();
        }}
      />

      {/* Details Modal */}
      <Dialog
        isOpen={isDetailsOpen}
        title="Tenant Details"
        onClose={() => setIsDetailsOpen(false)}
        maxWidth="max-w-2xl"
      >
        {viewingTenant && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Name</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900 break-words">
                  {viewingTenant.name}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Contact Number</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                  {viewingTenant.contactNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Shop Number</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                  {viewingTenant.shopNumber || viewingTenant.shopNo || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Monthly Rent</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                  {formatCurrency(Number(viewingTenant.monthlyRent ?? viewingTenant.rent ?? 0))}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Deposit Amount</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                  {formatCurrency(Number(viewingTenant.depositAmount ?? 0))}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lease Start Date</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                  {formatDate(viewingTenant.leaseStartDate || "")}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lease End Date</p>
                <p className="mt-1 text-base sm:text-lg font-semibold text-gray-900">
                  {formatDate(viewingTenant.leaseEndDate || "")}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg border border-gray-300 bg-white font-medium text-sm sm:text-base text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDetailsOpen(false);
                  handleEditTenant(viewingTenant);
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg bg-blue-600 font-medium text-sm sm:text-base text-white transition-colors hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
