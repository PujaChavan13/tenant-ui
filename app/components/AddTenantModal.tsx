"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Tenant } from "@/lib/types/tenant";
import { cn } from "@/lib/utils";
import { useTenant } from "@/app/context/ApiContext";

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tenant: Tenant) => void;
  editingTenant?: Tenant | null;
}

const initialFormData: Tenant = {
  id: "",
  name: "",
  contactNumber: "",
  depositAmount: 0,
  monthlyRent: 0,
  leaseStartDate: "",
  leaseEndDate: "",
  reminderType: "email",
  shopNumber: "",
};

export function AddTenantModal({
  isOpen,
  onClose,
  onSuccess,
  editingTenant,
}: AddTenantModalProps) {
  const [formData, setFormData] = useState<Tenant>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addTenant, updateTenantById } = useTenant();

  // Initialize or update form data when modal opens or editingTenant changes
  useEffect(() => {
    if (isOpen) {
      if (editingTenant) {
        setFormData(editingTenant);
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [isOpen, editingTenant]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    if (!formData.shopNumber?.trim())
      newErrors.shopNumber = "Shop number is required";
    if (formData.depositAmount <= 0)
      newErrors.depositAmount = "Deposit amount must be greater than 0";
    if (formData.monthlyRent <= 0)
      newErrors.monthlyRent = "Monthly rent must be greater than 0";
    if (!formData.leaseStartDate)
      newErrors.leaseStartDate = "Lease start date is required";
    if (!formData.leaseEndDate)
      newErrors.leaseEndDate = "Lease end date is required";
    if (new Date(formData.leaseStartDate) >= new Date(formData.leaseEndDate))
      newErrors.leaseEndDate = "Lease end date must be after start date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "depositAmount" || name === "monthlyRent"
          ? parseFloat(value) || 0
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let savedTenant: Tenant | null = null;
      if (editingTenant && (editingTenant.id || editingTenant._id)) {
        const tenantId = editingTenant.id || editingTenant._id;
        await updateTenantById(tenantId || "", formData);
        savedTenant = { ...formData, id: tenantId || formData.id };
      } else {
        savedTenant = await addTenant(formData);
      }

      if (!savedTenant) throw new Error("Failed to save tenant");
      onSuccess(savedTenant);
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to save tenant",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      title={editingTenant ? "Edit Tenant" : "Add Tenant"} 
      onClose={onClose} 
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {errors.submit}
          </div>
        )}

        {/* Name and Contact Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tenant name"
              className={cn(
                "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.name
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              )}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className={cn(
                "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.contactNumber
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              )}
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
            )}
          </div>
        </div>

        {/* Shop Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Number
          </label>
          <input
            type="text"
            name="shopNumber"
            value={formData.shopNumber || ""}
            onChange={handleChange}
            placeholder="Enter shop number"
            className={cn(
              "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
              errors.shopNumber
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white"
            )}
          />
          {errors.shopNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.shopNumber}</p>
          )}
        </div>

        {/* Deposit and Rent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount
            </label>
            <input
              type="number"
              name="depositAmount"
              value={formData.depositAmount || ""}
              onChange={handleChange}
              placeholder="Enter deposit amount"
              className={cn(
                "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.depositAmount
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              )}
            />
            {errors.depositAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.depositAmount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent
            </label>
            <input
              type="number"
              name="monthlyRent"
              value={formData.monthlyRent || ""}
              onChange={handleChange}
              placeholder="Enter monthly rent"
              className={cn(
                "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.monthlyRent
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              )}
            />
            {errors.monthlyRent && (
              <p className="mt-1 text-sm text-red-600">{errors.monthlyRent}</p>
            )}
          </div>
        </div>

        {/* Lease Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lease Start Date
            </label>
            <input
              type="date"
              name="leaseStartDate"
              value={formData.leaseStartDate}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.leaseStartDate
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              )}
            />
            {errors.leaseStartDate && (
              <p className="mt-1 text-sm text-red-600">{errors.leaseStartDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lease End Date
            </label>
            <input
              type="date"
              name="leaseEndDate"
              value={formData.leaseEndDate}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors.leaseEndDate
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              )}
            />
            {errors.leaseEndDate && (
              <p className="mt-1 text-sm text-red-600">{errors.leaseEndDate}</p>
            )}
          </div>
        </div>

        {/* Reminder Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reminder Type
          </label>
          <select
            name="reminderType"
            value={formData.reminderType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg border border-gray-300 bg-white font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (editingTenant ? "Updating..." : "Saving...") : (editingTenant ? "Update" : "Save")}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
