import * as React from "react";
import { cn } from "@/lib/utils";

/** Foco animado: borda e anel dourados com transição suave. */
export const fieldClasses =
  "flex w-full rounded-lg border border-input bg-background/60 px-4 text-base text-foreground shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-muted-foreground/70 hover:border-primary/40 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/15 md:text-sm";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldClasses, "h-12", className)} {...props} />
  ),
);
Input.displayName = "Input";
