"use client";

import { AnimatePresence, m } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface FieldControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: (props: FieldControlProps) => React.ReactNode;
}

/** Campo acessível: label, dica e erro ligados via aria-describedby; erro aparece com fade. */
export function Field({ id, label, error, hint, required, optional, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="flex items-center gap-1.5">
        {label}
        {required && (
          <span className="text-primary" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="text-xs font-normal text-muted-foreground">(opcional)</span>}
      </Label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required || undefined })}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            key={error}
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}
