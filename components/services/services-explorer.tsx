"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ServiceCard } from "./service-card";
import { CategoryIcon } from "./category-icon";
import { CATEGORY_LABELS, CATEGORY_SLUGS } from "@/lib/constants";
import { DURATION, EASE_OUT, STAGGER, fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SERVICE_CATEGORIES, type ServiceCategory, type ServiceDTO } from "@/types";

const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([cat, slug]) => [slug, cat]),
) as Record<string, ServiceCategory>;

export function ServicesExplorer({ services }: { services: ServiceDTO[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduced = useReducedMotion();

  const active: ServiceCategory | "ALL" = SLUG_TO_CATEGORY[params.get("categoria") ?? ""] ?? "ALL";

  const setCategory = useCallback(
    (cat: ServiceCategory | "ALL") => {
      const q = cat === "ALL" ? "" : `?categoria=${CATEGORY_SLUGS[cat]}`;
      router.replace(`${pathname}${q}`, { scroll: false });
    },
    [pathname, router],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: services.length };
    for (const s of services) c[s.category] = (c[s.category] ?? 0) + 1;
    return c;
  }, [services]);

  const filtered = active === "ALL" ? services : services.filter((s) => s.category === active);
  const filters: (ServiceCategory | "ALL")[] = ["ALL", ...SERVICE_CATEGORIES.filter((c) => counts[c])];

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrar serviços por categoria"
        className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((cat) => {
          const selected = active === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={selected}
              onClick={() => setCategory(cat)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97]",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
              )}
            >
              {cat !== "ALL" && <CategoryIcon category={cat} className="size-4" />}
              {cat === "ALL" ? "Todos" : CATEGORY_LABELS[cat]}
              <span className={cn("text-xs", selected ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                {counts[cat]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} serviços exibidos{active !== "ALL" ? ` na categoria ${CATEGORY_LABELS[active]}` : ""}.
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <m.ul
          key={active}
          variants={staggerContainer(STAGGER.tight)}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } }}
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((s) => (
            <m.li key={s.id} variants={fadeUp(reduced, 12)}>
              <ServiceCard service={s} />
            </m.li>
          ))}
        </m.ul>
      </AnimatePresence>
    </div>
  );
}
