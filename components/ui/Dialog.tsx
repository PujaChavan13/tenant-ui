"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Dialog({
  isOpen,
  title,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Dialog Container - Fully responsive */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div
          className={cn(
            "w-full rounded-lg bg-white shadow-xl transition-all duration-200 overflow-hidden max-h-[90vh] overflow-y-auto",
            maxWidth
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Responsive padding and font size */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-5 md:px-6 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 pr-2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close dialog"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content - Responsive padding */}
          <div className="p-4 sm:p-5 md:p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
