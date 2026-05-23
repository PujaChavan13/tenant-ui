import * as React from "react";
import { cn } from "@/lib/utils";

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** When set, shows error ring (use with aria-invalid from parent). */
  invalid?: boolean;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid && "border-destructive ring-2 ring-destructive/20",
          className
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  }
);
