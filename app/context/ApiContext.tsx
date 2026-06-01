"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Tenant } from "@/lib/types/tenant";
import {
  getAllTenants,
  createTenant,
  updateTenant,
  deleteTenant,
} from "@/app/services/tenantService";

type TenantContextType = {
  tenants: Tenant[];
  loading: boolean;
  error: string | null;

  fetchTenants: () => Promise<void>;
  addTenant: (data: Tenant) => Promise<Tenant | null>;
  updateTenantById: (id: string, data: Partial<Tenant>) => Promise<void>;
  deleteTenantById: (id: string) => Promise<void>;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch all tenants
  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllTenants();
      const data = Array.isArray(response) ? response : response.data || [];

      setTenants(data);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch tenants";
      setError(errorMsg);
      console.error("Fetch tenants error:", err);
      console.error("Make sure your backend API is running at:", process.env.NEXT_PUBLIC_API_URL);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Add tenant
  const addTenant = useCallback(async (data: Tenant) => {
    try {
      setError(null);

      const res = await createTenant(data);
      const newTenant = res?.data ?? null;

      if (newTenant) {
        setTenants((prev) => [newTenant, ...prev]);
      }

      return newTenant || null;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add tenant";
      setError(errorMsg);
      console.error("Add tenant error:", err);
      return null;
    }
  }, []);

  // ✅ Update tenant
  const updateTenantById = useCallback(async (id: string, data: Partial<Tenant>) => {
    try {
      setError(null);

      const res = await updateTenant(id, data);
      const updatedTenant = res?.data ?? null;

      if (updatedTenant) {
        setTenants((prev) =>
          prev.map((t) =>
            (t.id === id || t._id === id) ? updatedTenant : t
          )
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update tenant";
      setError(errorMsg);
      console.error("Update tenant error:", err);
      throw err;
    }
  }, []);

  // ✅ Delete tenant
  const deleteTenantById = useCallback(async (id: string) => {
    try {
      setError(null);

      await deleteTenant(id);

      setTenants((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to delete tenant";
      setError(errorMsg);
      console.error("Delete tenant error:", err);
      throw err;
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const value: TenantContextType = {
    tenants,
    loading,
    error,
    fetchTenants,
    addTenant,
    updateTenantById,
    deleteTenantById,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

// ✅ Custom hook
export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
};