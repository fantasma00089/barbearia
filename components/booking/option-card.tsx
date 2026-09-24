"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  indicator?: boolean;
}

/**
 * Opção selecionável baseada em <input type="radio"> nativo:
 * teclado (setas/Tab/Espaço) e leitores de tela funcionam sem JS extra.
 */
export function OptionCard({
  name,
  value,
  checked,
  onSelect,
  disabled,
  className,
  contentClassName,
  children,
  indicator = true,
}: OptionCardProps) {
  return (
    <label className={cn("group relative block", disabled ? "cursor-not-allowed" : "cursor-pointer", className)}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onSelect(value)}
        className="peer sr-only"
      />
      <div
        className={cn(
          "relative h-full rounded-xl border bg-card p-4 transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out",
          "hover:border-primary/50 active:scale-[0.985]",
          "peer-checked:border-primary peer-checked:bg-primary/[0.07] peer-checked:shadow-[0_0_0_1px_hsl(var(--primary))]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          "peer-disabled:opacity-45 peer-disabled:hover:border-border peer-disabled:active:scale-100",
          contentClassName,
        )}
      >
        {children}
        {indicator && (
          <span
            aria-hidden
            className="absolute right-3 top-3 inline-flex size-6 scale-50 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-[transform,opacity] duration-200 ease-out group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100"
          >
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
    </label>
  );
}
