"use client";

import { m } from "framer-motion";
import { Check } from "lucide-react";
import { bookingContent } from "@/config/content";
import { DURATION, EASE_IN_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STEPS = bookingContent.steps;

export function StepIndicator({
  current,
  maxReached,
  onNavigate,
}: {
  current: number;
  maxReached: number;
  onNavigate: (step: number) => void;
}) {
  const progress = (current + 1) / STEPS.length;
  return (
    <nav aria-label="Etapas do agendamento" className="space-y-4">
      <div className="flex items-baseline justify-between text-sm">
        <p className="font-medium">
          <span className="text-primary">Etapa {current + 1}</span>
          <span className="text-muted-foreground"> de {STEPS.length}</span>
          <span className="sr-only">: {STEPS[current]}</span>
        </p>
        <p className="text-muted-foreground sm:hidden" aria-hidden>
          {STEPS[current]}
        </p>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted" aria-hidden>
        <m.div
          className="h-full origin-left rounded-full bg-primary"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: DURATION.slow, ease: EASE_IN_OUT }}
        />
      </div>
      <ol className="hidden gap-1 sm:flex">
        {STEPS.map((label, i) => {
          const done = i < current;
          const reachable = i <= maxReached && i !== current;
          return (
            <li key={label} className="flex-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onNavigate(i)}
                aria-current={i === current ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-1 py-1 text-left text-xs transition-colors",
                  i === current ? "font-semibold text-foreground" : "text-muted-foreground",
                  reachable && "hover:text-primary",
                  !reachable && i !== current && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors",
                    i === current && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary/60 text-primary",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3} aria-hidden /> : i + 1}
                </span>
                <span className="truncate">{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
