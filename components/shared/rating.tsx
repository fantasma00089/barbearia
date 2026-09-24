import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, className, size = "sm" }: { value: number; className?: string; size?: "sm" | "md" }) {
  const full = Math.round(value);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Nota ${value.toFixed(1).replace(".", ",")} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(size === "sm" ? "size-3.5" : "size-4", i < full ? "fill-primary text-primary" : "text-muted-foreground/40")}
        />
      ))}
    </span>
  );
}
