import * as React from "react";
import { cn } from "@/lib/utils";
import { fieldClasses } from "./input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClasses, "min-h-24 resize-y py-3", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
