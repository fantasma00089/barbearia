"use client";

import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Parallax leve (translateY) apenas em telas grandes e sem reduced motion.
 * Em mobile ou reduced motion renderiza estático — nenhum custo de scroll.
 */
export function Parallax({
  children,
  offset = 40,
  className,
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <m.div ref={ref} className={className} style={enabled && !reduced ? { y } : undefined}>
      {children}
    </m.div>
  );
}
