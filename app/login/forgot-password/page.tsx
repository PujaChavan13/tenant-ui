import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Forgot password | Admin",
  description: "Reset your admin password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Mail className="size-6" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact your system administrator or backend team to reset your
          credentials. This placeholder page can be wired to your recovery API
          (e.g. POST <code className="rounded bg-muted px-1 py-0.5 text-xs">/auth/forgot-password</code>
          ).
        </p>
        <Button variant="outline" className="mt-8 w-full gap-2" asChild>
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    </div>
  );
}
