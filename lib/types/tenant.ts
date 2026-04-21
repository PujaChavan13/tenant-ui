export interface Tenant {
  id?: string;
  _id?: string;
  name: string;
  contactNumber: string;
  depositAmount: number;
  monthlyRent: number;
  rent?: number;
  leaseStartDate: string;
  leaseEndDate: string;
  reminderType: "email" | "sms" | "both";
  shopNo?: string;
  shopNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TenantResponse {
  success: boolean;
  data?: Tenant | Tenant[];
  error?: string;
  message?: string;
}

export interface PaginatedResponse {
  success: boolean;
  data: Tenant[];
  total: number;
  page: number;
  limit: number;
}
