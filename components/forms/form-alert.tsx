"use client";

import { AnimatePresence, m } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { DURATION, EASE_OUT } from "@/lib/motion";

type Variant = "error" | "success" | "info";

const ICONS = { error: AlertTriangle, success: CheckCircle2, info: Info };
const ALERT_VARIANT = { error: "destructive", success: "success", info: "info" } as const;

/**
 * Mensagem de formulário acessível: `role="alert"` para erros (anunciado na hora)
 * e `role="status"` para sucesso/informação (anúncio educado).
 */
export function FormAlert({
  message,
  variant = "error",
  children,
  className,
}: {
  message?: string | null;
  variant?: Variant;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = ICONS[variant];
  return (
    <div role={variant === "error" ? "alert" : "status"} aria-live={variant === "error" ? "assertive" : "polite"}>
      <AnimatePresence initial={false}>
        {message && (
          <m.div
            key={message}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className={className}
          >
            <Alert variant={ALERT_VARIANT[variant]}>
              <Icon aria-hidden />
              <div className="space-y-2">
                <p>{message}</p>
                {children}
              </div>
            </Alert>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
