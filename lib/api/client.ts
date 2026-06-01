import axios, { type AxiosError } from "axios";
import { clearAuthStorage, getAccessToken } from "@/lib/auth/storage";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

let unauthorizedHandler: (() => void) | null = null;

/** Register handler for 401 responses (e.g. AuthContext logout + redirect). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      clearAuthStorage();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);
