"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarCheck, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";
import { HeroArt } from "./hero-art";
import { homeContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { DURATION, EASE_OUT, fadeUp, staggerContainer } from "@/lib/motion";

export function Hero() {
  const reduced = useReducedMotion();
  const item = fadeUp(reduced, 20);
  const { hero } = homeContent;

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-40 top-10 size-[32rem] rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-ember/10 blur-3xl" aria-hidden />

      <div className="container relative grid items-center gap-12 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-28">
        <m.div variants={staggerContainer(0.08, 0.05)} initial="hidden" animate="show">
          <m.p variants={item} className="eyebrow mb-6">
            <MapPin className="size-3.5" aria-hidden />
            {hero.eyebrow}
          </m.p>

          <h1 id="hero-title" className="text-[2.75rem] font-semibold uppercase leading-[0.98] sm:text-6xl xl:text-7xl">
            <span className="sr-only">{siteConfig.name} — </span>
            {hero.titleLines.map((line, i) => (
              <m.span key={line} variants={item} className={i === 1 ? "text-gradient-gold block" : "block"}>
                {line}
              </m.span>
            ))}
          </h1>

          <m.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.subtitle}
          </m.p>

          <m.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/agendar">
                <CalendarCheck aria-hidden />
                {hero.primaryCta}
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/servicos">{hero.secondaryCta}</Link>
            </Button>
          </m.div>

          <m.div variants={item} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Star className="size-4 fill-primary text-primary" aria-hidden />
              <strong className="text-foreground">{siteConfig.stats.rating.toFixed(1).replace(".", ",")}</strong> no Google
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" aria-hidden />
            <span>{hero.badge}</span>
          </m.div>
        </m.div>

        <m.div
          className="relative hidden sm:block"
          initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION.slow + 0.1, ease: EASE_OUT, delay: 0.15 }}
        >
          <Parallax offset={48}>
            <HeroArt />
          </Parallax>
        </m.div>
      </div>
    </section>
  );
}
