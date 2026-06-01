"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { AdminUser } from "@/lib/types/auth";
import { loginRequest } from "@/app/services/authService";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  persistAuthSession,
} from "@/lib/auth/storage";
import { getSessionIdleMs } from "@/lib/auth/constants";
import { setUnauthorizedHandler } from "@/lib/api/client";

type AuthContextValue = {
  user: AdminUser | null;
  token: string | null;
  /** True after client has read storage */
  isHydrated: boolean;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: (reason?: "manual" | "idle" | "unauthorized") => void;
  resetSessionTimer: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggingOutRef = useRef(false);

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const logout = useCallback(
    (reason: "manual" | "idle" | "unauthorized" = "manual") => {
      if (loggingOutRef.current) return;
      loggingOutRef.current = true;
      clearAuthStorage();
      setUser(null);
      setToken(null);
      clearIdleTimer();

      if (reason === "idle") {
        toast.message("Session ended", {
          description: "You were signed out due to inactivity.",
        });
      } else if (reason === "unauthorized") {
        toast.error("Session expired", {
          description: "Please sign in again.",
        });
      }

      if (pathname !== "/login" && !pathname?.startsWith("/login")) {
        router.replace("/login");
      }
      queueMicrotask(() => {
        loggingOutRef.current = false;
      });
    },
    [clearIdleTimer, pathname, router]
  );

  const scheduleIdleLogout = useCallback(() => {
    clearIdleTimer();
    const ms = getSessionIdleMs();
    idleTimerRef.current = setTimeout(() => {
      logout("idle");
    }, ms);
  }, [clearIdleTimer, logout]);

  const resetSessionTimer = useCallback(() => {
    if (!getAccessToken()) return;
    scheduleIdleLogout();
  }, [scheduleIdleLogout]);

  // Hydrate from storage on mount
  useEffect(() => {
    const storedToken = getAccessToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      scheduleIdleLogout();
    }
    setIsHydrated(true);
  }, [scheduleIdleLogout]);

  // Activity listeners for session timeout
  useEffect(() => {
    if (!token) return;
    const onActivity = () => resetSessionTimer();
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [token, resetSessionTimer]);

  // Axios 401 → logout
  useEffect(() => {
    setUnauthorizedHandler(() => logout("unauthorized"));
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const login = useCallback(
    async (email: string, password: string, remember: boolean) => {
      setIsLoggingIn(true);
      try {
        const result = await loginRequest(email, password);
        persistAuthSession(result.token, result.user, remember);
        setToken(result.token);
        setUser(result.user);
        scheduleIdleLogout();
        toast.success("Signed in", { description: "Welcome back." });
        router.replace("/dashboard");
      } catch (err: unknown) {
        let description = "Unable to sign in. Try again.";
        if (isAxiosError(err)) {
          const data = err.response?.data as { message?: string } | undefined;
          if (data?.message) description = data.message;
          else if (err.message) description = err.message;
        } else if (err instanceof Error) {
          description = err.message;
        }
        toast.error("Login failed", { description });
        throw err;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [router, scheduleIdleLogout]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isHydrated,
      isAuthenticated: Boolean(token && user),
      isLoggingIn,
      login,
      logout,
      resetSessionTimer,
    }),
    [user, token, isHydrated, isLoggingIn, login, logout, resetSessionTimer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
