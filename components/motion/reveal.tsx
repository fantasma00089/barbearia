"use client";

import { m, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DURATION, EASE_OUT, OFFSET, STAGGER, VIEWPORT, fadeUp, staggerContainer } from "@/lib/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  distance?: number;
  as?: "div" | "section" | "li" | "article";
};

/** Seção/elemento que aparece com fade + translateY ao entrar na tela (uma vez). */
export function Reveal({ delay = 0, distance = OFFSET, as = "div", children, ...props }: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = m[as] as typeof m.div;
  return (
    <Comp
      data-reveal
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </Comp>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
};

/** Container que revela os filhos (`StaggerItem`) em cascata. */
export function Stagger({ stagger = STAGGER.base, delay = 0, as = "div", children, ...props }: StaggerProps) {
  const Comp = m[as] as typeof m.div;
  return (
    <Comp variants={staggerContainer(stagger, delay)} initial="hidden" whileInView="show" viewport={VIEWPORT} {...props}>
      {children}
    </Comp>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & { as?: "div" | "li" | "article" };

export function StaggerItem({ as = "div", children, ...props }: StaggerItemProps) {
  const reduced = useReducedMotion();
  const Comp = m[as] as typeof m.div;
  return (
    <Comp data-reveal variants={fadeUp(reduced)} {...props}>
      {children}
    </Comp>
  );
}
