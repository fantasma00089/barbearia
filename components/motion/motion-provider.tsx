"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * - LazyMotion carrega só as features necessárias (bundle menor).
 * - reducedMotion="user" respeita prefers-reduced-motion automaticamente:
 *   transforms são desativados e só a opacidade anima.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
