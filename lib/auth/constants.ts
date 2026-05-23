/** localStorage key: persist "remember me" preference */
export const REMEMBER_PREFERENCE_KEY = "admin_remember_preference";

export const STORAGE_KEYS = {
  token: "admin_auth_token",
  user: "admin_user",
} as const;

/** Default idle timeout before auto-logout (ms). Override with NEXT_PUBLIC_SESSION_IDLE_MS */
export const DEFAULT_SESSION_IDLE_MS = 30 * 60 * 1000;

export function getSessionIdleMs(): number {
  if (typeof process === "undefined" || !process.env.NEXT_PUBLIC_SESSION_IDLE_MS) {
    return DEFAULT_SESSION_IDLE_MS;
  }
  const parsed = Number.parseInt(process.env.NEXT_PUBLIC_SESSION_IDLE_MS, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SESSION_IDLE_MS;
}
