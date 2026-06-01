import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { AppProviders } from "@/components/providers/Providers";
import { AuthProvider } from "./context/AuthContext";
import { TenantProvider } from "./context/ApiContext";
import { ReminderProvider } from "./context/ReminderContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Admin Dashboard",
  description: "Modern admin panel for managing tenants and shops",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>
          <AuthProvider>
            <TenantProvider>
              <ReminderProvider>{children}</ReminderProvider>
            </TenantProvider>
          </AuthProvider>
        </AppProviders>
      </body>
    </html>
  );
}
