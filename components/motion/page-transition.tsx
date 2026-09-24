"use client";

import { useEffect } from "react";
import { m } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";

// No primeiro carregamento não animamos (conteúdo já visível no SSR → melhor LCP).
let hasNavigated = false;

/** Fade curto entre rotas. Não bloqueia cliques nem rolagem. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.page, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
