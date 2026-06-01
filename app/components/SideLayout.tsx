"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { DashboardPage } from "./DashboardPage";
import { TenantsList } from "./TenantsList";
import { ReminderPage } from "./ReminderPage";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children?: React.ReactNode;
}

function ShopsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shops Management</h1>
        <p className="text-gray-600 mt-2">Coming soon...</p>
      </header>
    </div>
  );
}

function PaymentsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">Coming soon...</p>
      </header>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Coming soon...</p>
      </header>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const getPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardPage
            onNavigate={(pageId) => {
              setCurrentPage(pageId);
              setSidebarOpen(false);
            }}
          />
        );
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
      default:
        return (
          children ?? (
            <DashboardPage
              onNavigate={(pageId) => {
                setCurrentPage(pageId);
                setSidebarOpen(false);
              }}
            />
          )
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 inline-flex items-center justify-center rounded-lg bg-blue-900 p-2 text-white md:hidden hover:bg-blue-800 transition-colors"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-overlay backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop Fixed + Mobile Absolute */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 md:z-0 transition-transform duration-300",
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pl-64">
        <div className="pt-16 md:pt-0">{getPageContent()}</div>
      </main>
    </div>
  );
}
