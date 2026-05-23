import * as React from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: React.ReactNode;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, label, id, ...props }, ref) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none",
          "hover:text-foreground transition-colors",
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="size-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring/50"
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  }
);
