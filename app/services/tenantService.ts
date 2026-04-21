import {
  Tenant,
  TenantResponse,
  PaginatedResponse,

} from "@/lib/types/tenant";

// TODO: Update with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TENANTS_ENDPOINT = `${API_BASE_URL}/tenants`;

type ApiTenant = Partial<Tenant> & {
  _id?: string;
  rent?: number;
  [key: string]: unknown;
};

function normalizeTenant(tenant: ApiTenant): Tenant {
  return {
    id: tenant?.id ?? tenant?._id ?? "",
    _id: tenant?._id,
    name: tenant?.name ?? "",
    contactNumber: tenant?.contactNumber ?? "",
    depositAmount: Number(tenant?.depositAmount ?? 0),
    monthlyRent: Number(tenant?.monthlyRent ?? tenant?.rent ?? 0),
    rent: Number(tenant?.rent ?? tenant?.monthlyRent ?? 0),
    leaseStartDate: tenant?.leaseStartDate ?? "",
    leaseEndDate: tenant?.leaseEndDate ?? "",
    reminderType: tenant?.reminderType ?? "email",
    shopNumber: tenant?.shopNumber ?? tenant?.shopNo ?? "",
    shopNo: tenant?.shopNo ?? tenant?.shopNumber ?? "",
    createdAt: tenant?.createdAt,
    updatedAt: tenant?.updatedAt,
  };
}

/**
 * Fetch all tenants from the backend
 * @param page - Page number for pagination (default: 1)
 * @param limit - Records per page (default: 10)
 * @returns Promise with tenant data
 */
export async function getAllTenants(page: number = 1, limit: number = 10): Promise<PaginatedResponse | Tenant[]> {
  try {
    console.log(`Fetching tenants from: ${TENANTS_ENDPOINT}?page=${page}&limit=${limit}`);
    
    const response = await fetch(`${TENANTS_ENDPOINT}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenants: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data.map(normalizeTenant);
    }

    if (Array.isArray(data?.data)) {
      return {
        ...data,
        data: data.data.map(normalizeTenant),
      };
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching tenants:", errorMessage);
    console.error("API Base URL:", API_BASE_URL);
    console.error("Tenants Endpoint:", TENANTS_ENDPOINT);
    throw new Error(`Failed to fetch tenants from ${TENANTS_ENDPOINT}: ${errorMessage}`);
  }
}

/**
 * Fetch a single tenant by ID
 * @param id - Tenant ID
 * @returns Promise with tenant data
 */
export async function getTenantById(id: string): Promise<TenantResponse> {
  try {
    const response = await fetch(`${TENANTS_ENDPOINT}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant: ${response.statusText}`);
    }

    const data = await response.json();
    if (data?.data) {
      const normalized = Array.isArray(data.data)
        ? normalizeTenant(data.data[0] ?? {})
        : normalizeTenant(data.data);
      return { ...data, data: normalized };
    }
    return { ...data, data: undefined };
  } catch (error) {
    console.error(`Error fetching tenant ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new tenant
 * @param tenantData - Tenant object with required fields
 * @returns Promise with created tenant data
 */
export async function createTenant(
  tenantData: Tenant
): Promise<TenantResponse> {
  try {
    // Transform frontend field names to backend field names
    const backendData = {
      name: tenantData.name,
      contactNumber: tenantData.contactNumber,
      shopNumber: tenantData.shopNumber,
      depositAmount: tenantData.depositAmount,
      rent: tenantData.monthlyRent, // Backend expects "rent"
      leaseStartDate: tenantData.leaseStartDate,
      leaseEndDate: tenantData.leaseEndDate,
      reminderType: tenantData.reminderType,
    };

    const response = await fetch(TENANTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create tenant: ${response.statusText}`);
    }

    const data = await response.json();
    if (data?.data) {
      const normalized = Array.isArray(data.data)
        ? normalizeTenant(data.data[0] ?? {})
        : normalizeTenant(data.data);
      return { ...data, data: normalized };
    }
    return { ...data, data: undefined };
  } catch (error) {
    console.error("Error creating tenant:", error);
    throw error;
  }
}

/**
 * Update an existing tenant
 * @param id - Tenant ID
 * @param tenantData - Updated tenant data
 * @returns Promise with updated tenant data
 */
export async function updateTenant(
  id: string,
  tenantData: Partial<Tenant>
): Promise<TenantResponse> {
  try {
    // Transform frontend field names to backend field names
    const backendData: Record<string, unknown> = {};
    
    if (tenantData.name !== undefined) backendData.name = tenantData.name;
    if (tenantData.contactNumber !== undefined) backendData.contactNumber = tenantData.contactNumber;
    if (tenantData.shopNumber !== undefined) backendData.shopNumber = tenantData.shopNumber;
    if (tenantData.depositAmount !== undefined) backendData.depositAmount = tenantData.depositAmount;
    if (tenantData.monthlyRent !== undefined) backendData.rent = tenantData.monthlyRent; // Backend expects "rent"
    if (tenantData.leaseStartDate !== undefined) backendData.leaseStartDate = tenantData.leaseStartDate;
    if (tenantData.leaseEndDate !== undefined) backendData.leaseEndDate = tenantData.leaseEndDate;
    if (tenantData.reminderType !== undefined) backendData.reminderType = tenantData.reminderType;

    const response = await fetch(`${TENANTS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update tenant: ${response.statusText}`);
    }

    const data = await response.json();
    if (data?.data) {
      const normalized = Array.isArray(data.data)
        ? normalizeTenant(data.data[0] ?? {})
        : normalizeTenant(data.data);
      return { ...data, data: normalized };
    }
    return { ...data, data: undefined };
  } catch (error) {
    console.error(`Error updating tenant ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a tenant
 * @param id - Tenant ID
 * @returns Promise with confirmation
 */
export async function deleteTenant(id: string): Promise<TenantResponse> {
  try {
    const response = await fetch(`${TENANTS_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete tenant: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting tenant ${id}:`, error);
    throw error;
  }
}
