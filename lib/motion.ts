/**
 * Tokens de animação — um único lugar para ajustar ritmo e suavidade.
 * Regras: 150–400ms em microinterações, ≤500ms em transições maiores,
 * apenas transform/opacity, ease-out na entrada.
 */
import type { Transition, Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.3,
  slow: 0.4,
  page: 0.22,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.08,
} as const;

export const OFFSET = 16;

export const enterTransition: Transition = { duration: DURATION.base, ease: EASE_OUT };

/** Fade + leve translateY. Com reduced motion, apenas fade. */
export function fadeUp(reduced: boolean | null, distance = OFFSET): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    show: { opacity: 1, y: 0, transition: enterTransition },
  };
}

export function staggerContainer(stagger: number = STAGGER.base, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/** Viewport padrão do reveal: uma vez por elemento, disparando um pouco antes. */
export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
