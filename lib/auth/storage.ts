import type { AdminUser } from "@/lib/types/auth";
import { REMEMBER_PREFERENCE_KEY, STORAGE_KEYS } from "@/lib/auth/constants";

function parseUser(raw: string | null): AdminUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

function getStorage(persistent: boolean): Storage {
  if (typeof window === "undefined") {
    throw new Error("Storage is only available in the browser");
  }
  return persistent ? localStorage : sessionStorage;
}

export function getRememberPreference(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(REMEMBER_PREFERENCE_KEY) !== "0";
}

export function setRememberPreference(remember: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMEMBER_PREFERENCE_KEY, remember ? "1" : "0");
}

/** Read token: sessionStorage first (current tab session), then localStorage (remember me). */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  const fromSession = sessionStorage.getItem(STORAGE_KEYS.token);
  if (fromSession) return fromSession;
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const fromSession = parseUser(sessionStorage.getItem(STORAGE_KEYS.user));
  if (fromSession) return fromSession;
  return parseUser(localStorage.getItem(STORAGE_KEYS.user));
}

export function persistAuthSession(
  token: string,
  user: AdminUser,
  remember: boolean
): void {
  if (typeof window === "undefined") return;
  const primary = getStorage(remember);
  const secondary = getStorage(!remember);
  secondary.removeItem(STORAGE_KEYS.token);
  secondary.removeItem(STORAGE_KEYS.user);
  primary.setItem(STORAGE_KEYS.token, token);
  primary.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  setRememberPreference(remember);
}

export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.token);
  sessionStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}
