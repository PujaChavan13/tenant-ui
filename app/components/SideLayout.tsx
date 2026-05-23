"use client";

import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { TenantsList } from "./TenantsList";
import { ReminderPage } from "./ReminderPage";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

interface LayoutProps {
  children?: React.ReactNode;
}

function DashboardPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Welcome to Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your shops, tenants, and payments efficiently
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="mb-4 h-12 w-12 rounded-lg bg-primary/15" />
            <h3 className="font-semibold text-card-foreground">Card {item}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a content placeholder card.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Shops Management
        </h1>
        <p className="mt-2 text-muted-foreground">Coming soon...</p>
      </header>
    </div>
  );
}

function PaymentsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Payments
        </h1>
        <p className="mt-2 text-muted-foreground">Coming soon...</p>
      </header>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">Coming soon...</p>
      </header>
    </div>
  );
}

const PAGE_SUBTITLE: Record<string, string> = {
  dashboard: "Overview & insights",
  shops: "Shop units",
  tenants: "Tenant directory",
  reminders: "Lease reminders",
  payments: "Rent collection",
  settings: "Workspace preferences",
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const headerSubtitle = useMemo(
    () => PAGE_SUBTITLE[currentPage] ?? "Operations",
    [currentPage]
  );

  const getPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "shops":
        return <ShopsPage />;
      case "tenants":
        return (
          <div className="p-6 md:p-8">
            <TenantsList />
          </div>
        );
      case "reminders":
        return <ReminderPage />;
      case "payments":
        return <PaymentsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return children || <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-40 inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 md:hidden"
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[1px] transition-opacity md:hidden"
          aria-label="Close menu overlay"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 md:static md:z-0 md:translate-x-0",
          "transition-transform duration-300 ease-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Sidebar
          activeItem={currentPage}
          onNavigation={(pageId) => {
            setCurrentPage(pageId);
            setSidebarOpen(false);
          }}
        />
      </div>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden md:pl-0">
        <DashboardHeader subtitle={headerSubtitle} />
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-0">{getPageContent()}</div>
        </div>
      </main>
    </div>
  );
}
