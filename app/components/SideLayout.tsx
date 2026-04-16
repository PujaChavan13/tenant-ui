"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
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
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pl-64">
        <div className="pt-16 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
