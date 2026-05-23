"use client";

import type { ReactNode } from "react";
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
import { useAuth } from "@/app/context/AuthContext";

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
}

interface SidebarProps {
  activeItem?: string;
  onNavigation?: (itemId: string) => void;
}

export default function Sidebar({
  activeItem = "dashboard",
  onNavigation,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "#" },
    { id: "shops", label: "Shops", icon: <ShoppingCart size={20} />, href: "#" },
    { id: "tenants", label: "Tenants", icon: <Users size={20} />, href: "#" },
    { id: "reminders", label: "Reminders", icon: <Bell size={20} />, href: "#" },
    { id: "payments", label: "Payments", icon: <CreditCard size={20} />, href: "#" },
    { id: "settings", label: "Settings", icon: <Settings size={20} />, href: "#" },
  ];

  const handleNavigation = (itemId: string) => {
    onNavigation?.(itemId);
  };

  const displayName = user?.name ?? "Admin";
  const displayEmail = user?.email ?? "";
  const initial = (displayName[0] ?? displayEmail[0] ?? "?").toUpperCase();

  return (
    <div className="relative flex h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground shadow-xl transition-colors md:w-64">
      <div className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 rounded-xl bg-sidebar-primary p-2.5 text-sidebar-primary-foreground">
            <LayoutDashboard size={24} aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight">Rent Admin</h1>
            <p className="truncate text-xs text-muted-foreground">Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavigation(item.id)}
            className={cn(
              "group relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200",
              activeItem === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )}
          >
            {activeItem === item.id ? (
              <span
                className="absolute inset-y-1 left-0 w-1 rounded-full bg-sidebar-primary"
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 shrink-0 transition-transform duration-200",
                activeItem === item.id ? "scale-110" : "group-hover:scale-105"
              )}
            >
              {item.icon}
            </span>
            <span className="relative z-10 flex-1 truncate">{item.label}</span>
            {activeItem === item.id ? (
              <ChevronRight
                size={16}
                className="relative z-10 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5"
              />
            ) : null}
          </button>
        ))}
      </nav>

      <div className="mx-3 border-t border-sidebar-border" />

      <div className="space-y-2 p-3">
        <div className="flex items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-sm font-bold text-sidebar-primary">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => logout("manual")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
