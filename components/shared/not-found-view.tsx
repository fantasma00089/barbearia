"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFoundContent } from "@/config/content";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

export function NotFoundView() {
  const reduced = useReducedMotion();
  const item = fadeUp(reduced);
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <m.div variants={staggerContainer(0.08)} initial="hidden" animate="show" className="flex flex-col items-center">
        {/* Tesoura que "corta" o 404 — um único movimento curto */}
        <m.div variants={item} className="relative" aria-hidden>
          <p className="font-display text-[8rem] font-semibold leading-none text-muted-foreground/20 sm:text-[11rem]">404</p>
          <m.svg
            viewBox="0 0 64 32"
            className="absolute left-1/2 top-1/2 w-24 -translate-y-1/2 text-primary sm:w-32"
            initial={{ x: reduced ? "-50%" : "-120%", opacity: 0 }}
            animate={{ x: "-50%", opacity: 1 }}
            transition={{ duration: DURATION.slow + 0.1, ease: EASE_OUT, delay: 0.2 }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <circle cx="9" cy="9" r="6" />
            <circle cx="9" cy="23" r="6" />
            <path d="M14 12 L60 26" />
            <path d="M14 20 L60 6" />
          </m.svg>
        </m.div>
        <m.h1 variants={item} className="mt-4 text-4xl font-semibold uppercase sm:text-5xl">
          {notFoundContent.title}
        </m.h1>
        <m.p variants={item} className="mt-3 max-w-md text-muted-foreground">
          {notFoundContent.description}
        </m.p>
        <m.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft aria-hidden /> Voltar ao início
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/agendar">
              <CalendarCheck aria-hidden /> Agendar horário
            </Link>
          </Button>
        </m.div>
      </m.div>
    </section>
  );
}
