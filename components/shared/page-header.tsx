import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Cabeçalho das páginas internas. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b", className)}>
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div className="container relative py-14 md:py-20">
        <Reveal className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-4xl font-semibold uppercase leading-[1.02] sm:text-6xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
