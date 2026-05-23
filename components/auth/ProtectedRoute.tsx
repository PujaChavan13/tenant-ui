"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";

type ProtectedRouteProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Client guard: only renders children when a JWT exists in storage (hydrated).
 * Unauthenticated users are sent to `/login`.
 */
export function ProtectedRoute({ children, className }: ProtectedRouteProps) {
  const { isHydrated, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center bg-background",
          className
        )}
      >
        <Loader2 className="size-10 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className={cn(
          "flex min-h-screen items-center justify-center bg-background",
          className
        )}
      >
        <Loader2 className="size-10 animate-spin text-muted-foreground" aria-label="Redirecting" />
      </div>
    );
  }

  return <>{children}</>;
}
