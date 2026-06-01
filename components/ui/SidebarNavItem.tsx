import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Reusable sidebar navigation item component
 * Used in the Sidebar for consistent styling and behavior
 */
export function SidebarNavItem({
  label,
  icon,
  isActive = false,
  isCollapsed = false,
  onClick,
  className,
}: SidebarNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out relative overflow-hidden justify-center md:justify-start",
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-blue-100 hover:bg-blue-700/50 hover:text-white",
        className
      )}
      title={isCollapsed ? label : ""}
    >
      {/* Background animation for active item */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}

      {/* Icon and Label Container */}
      <div className="relative flex items-center gap-3 z-10 flex-1 justify-start">
        <span
          className={cn(
            "transition-transform duration-200 flex-shrink-0",
            isActive ? "scale-110" : "group-hover:scale-105"
          )}
        >
          {icon}
        </span>

        {!isCollapsed && (
          <span className="flex-1 text-left truncate">{label}</span>
        )}
      </div>
    </button>
  );
}
