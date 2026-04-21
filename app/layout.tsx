import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { TenantProvider } from "./context/ApiContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-gray-50 text-gray-900">
        <TenantProvider>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}