"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Edit,
  Trash2,
  Plus,
  Loader,
} from "lucide-react";
import { Tenant } from "@/lib/types/tenant";
import { getAllTenants, deleteTenant } from "@/app/services/tenantService";
import { AddTenantModal } from "./AddTenantModal";

export function TenantsList() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTenants();
      const tenantList = Array.isArray(data) ? data : data.data || [];
      setTenants(tenantList);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tenants"
      );
      console.error("Error loading tenants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddTenant = async () => {
    // Avoid optimistic prepend + refetch, which can briefly duplicate rows.
    await fetchTenants();
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return;

    try {
      await deleteTenant(id);
      setTenants((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete tenant"
      );
    }
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
          <Loader size={40} className="mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading tenants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tenants List</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all your tenants and lease information
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Tenant
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Tenant Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Shop No.
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Rent
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Lease Dates
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <div className="text-center">
                    <FileText
                      size={40}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-gray-500">No tenants found</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      Add your first tenant
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr
                  key={tenant.id || tenant._id || `${tenant.name}-${tenant.shopNumber}-${tenant.createdAt}`}
                  className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {tenant.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tenant.shopNumber || tenant.shopNo || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tenant.contactNumber || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(Number(tenant.monthlyRent ?? tenant.rent ?? 0))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(tenant.leaseStartDate || "")} -{" "}
                    {formatDate(tenant.leaseEndDate || "")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          /* TODO: Implement view/edit */
                        }}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        title="View/Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          (tenant.id || tenant._id) &&
                          handleDeleteTenant(tenant.id || tenant._id || "")
                        }
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        title="View Details"
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddTenant}
      />
    </div>
  );
}
