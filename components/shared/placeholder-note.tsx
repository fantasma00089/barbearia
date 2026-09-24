import { Info } from "lucide-react";

/** Aviso discreto para conteúdo fictício — remova ao publicar com dados reais. */
export function PlaceholderNote({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_HIDE_DEMO_NOTES === "true") return null;
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/30 px-3 py-1 text-[11px] text-muted-foreground">
      <Info className="size-3.5 text-primary/80" aria-hidden />
      {children}
    </p>
  );
}
