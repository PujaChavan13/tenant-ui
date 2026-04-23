"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  Bell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  activeItem?: string;
  onNavigation?: (itemId: string) => void;
}

export default function Sidebar({ activeItem: initialActiveItem = "dashboard", onNavigation }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(initialActiveItem);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "#" },
    { id: "shops", label: "Shops", icon: <ShoppingCart size={20} />, href: "#" },
    { id: "tenants", label: "Tenants", icon: <Users size={20} />, href: "#" },
    { id: "reminders", label: "Reminders", icon: <Bell size={20} />, href: "#" },
    { id: "payments", label: "Payments", icon: <CreditCard size={20} />, href: "#" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, href: "#" },
  ];

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId);
    onNavigation?.(itemId);
  };

  return (
    <div
      className={cn(
        "relative h-screen flex flex-col bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 ease-in-out shadow-lg",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header Section */}
      <div className="border-b border-blue-700 p-6">
        <div className="flex items-center justify-between gap-3">
          {!collapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-lg bg-blue-600 p-2.5 flex-shrink-0">
                <LayoutDashboard size={24} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold leading-tight truncate">Admin</h1>
                <p className="text-xs text-blue-200 truncate">Dashboard</p>
              </div>
            </div>
          )}
          {!collapsed && (
            <div className="flex-shrink-0">
              <LayoutDashboard size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={cn(
              "group w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out relative overflow-hidden justify-center md:justify-start",
              activeItem === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
            )}
            title={collapsed ? item.label : ""}
          >
            {/* Background animation for active item */}
            {activeItem === item.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}

            {/* Icon and Label Container */}
            <div className="relative flex items-center gap-3 z-10 flex-1 justify-start">
              <span
                className={cn(
                  "transition-transform duration-200 flex-shrink-0",
                  activeItem === item.id ? "scale-110" : "group-hover:scale-105"
                )}
              >
                {item.icon}
              </span>

              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {activeItem === item.id && (
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1 flex-shrink-0" />
                  )}
                </>
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-blue-700" />

      {/* Footer Section - User Info */}
      <div className="border-t border-blue-700 p-4">
        <div className="mb-4 flex items-center gap-3 p-2 md:px-4 md:py-3 rounded-lg bg-blue-700/30 transition-colors duration-200 justify-center md:justify-start">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={20} />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 hidden md:block">
              <p className="truncate text-sm font-semibold">Admin User</p>
              <p className="truncate text-xs text-blue-200">admin@company.com</p>
            </div>
          )}
        </div>

        <button
          className={cn(
            "group w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-blue-100 transition-all duration-200 ease-in-out hover:bg-red-600/20 hover:text-red-200 justify-center md:justify-start"
          )}
          title={collapsed ? "Logout" : ""}
        >
          <span className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
            <LogOut size={20} />
          </span>
          {!collapsed && <span className="hidden md:inline">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle Button - Hidden on mobile, visible on desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-600 p-1.5 text-white shadow-lg transition-all duration-200 hover:bg-blue-500 hover:scale-110 z-50"
      >
        <ChevronRight
          size={18}
          className={cn(
            "transition-transform duration-300",
            collapsed ? "rotate-180" : ""
          )}
        />
      </button>
    </div>
  );
}