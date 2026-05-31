"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { TextInput } from "@/components/forms/TextInput";
import { Checkbox } from "@/components/forms/Checkbox";
import { useAuth } from "@/app/context/AuthContext";
import { getRememberPreference } from "@/lib/auth/storage";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

type FieldErrors = {
  email?: string;
  password?: string;
};

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const e = email.trim();
  if (!e) errors.email = "Email is required";
  else if (!EMAIL_RE.test(e)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  else if (password.length < MIN_PASSWORD)
    errors.password = `Password must be at least ${MIN_PASSWORD} characters`;
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isHydrated, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => getRememberPreference());
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, isHydrated, router]);

  const fieldErrors = validate(email, password);
  const showErrors = submitAttempted || touched.email || touched.password;
  const emailError = showErrors ? fieldErrors.email : undefined;
  const passwordError = showErrors ? fieldErrors.password : undefined;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    const errs = validate(email, password);
    if (errs.email || errs.password) return;
    try {
      await login(email.trim(), password, remember);
    } catch {
      /* toast handled in AuthContext */
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-10 animate-spin text-primary" aria-label="Redirecting" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background dark:from-primary/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-primary/10 blur-3xl animate-in fade-in duration-700"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 size-72 rounded-full bg-chart-2/20 blur-3xl animate-in fade-in duration-700"
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md",
          "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500"
        )}
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 transition-transform hover:scale-105">
            <Building2 className="size-8" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Rent management system — authorized personnel only
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/5 backdrop-blur-sm transition-shadow dark:shadow-black/40 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              id="email"
              label="Email"
              error={emailError}
              hint="Use your work email"
            >
              <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@company.com"
                value={email}
                invalid={Boolean(emailError)}
                onChange={(ev) => setEmail(ev.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              />
            </FormField>

            <FormField id="password" label="Password" error={passwordError}>
              <div className="relative">
                <TextInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  invalid={Boolean(passwordError)}
                  className="pr-11"
                  onChange={(ev) => setPassword(ev.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </FormField>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Checkbox
                id="remember"
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <Link
                href="/login/forgot-password"
                className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-11 w-full text-base transition-transform active:scale-[0.99]"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing you agree to your organization&apos;s access policies.
        </p>
      </div>
    </div>
  );
}
