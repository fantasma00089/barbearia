import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative flex gap-3 rounded-lg border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0", {
  variants: {
    variant: {
      default: "border-border bg-card text-foreground [&>svg]:text-primary",
      destructive: "border-destructive/40 bg-destructive/10 text-foreground [&>svg]:text-destructive",
      success: "border-success/40 bg-success/10 text-foreground [&>svg]:text-success",
      info: "border-primary/30 bg-primary/5 text-foreground [&>svg]:text-primary",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Alert({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return <div className={cn(alertVariants({ variant }), className)} {...props} />;
}
