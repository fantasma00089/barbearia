"use client";

import Link from "next/link";
import { useSettings } from "@/components/providers/settings-provider";
import { SmartImage } from "@/components/shared/smart-image";
import { cn } from "@/lib/utils";

/** Emblema em SVG (navalha cruzada). Substituído pela logo enviada no painel, se houver. */
export function LogoMark({ className }: { className?: string }) {
  const { brand } = useSettings();
  if (brand.logoUrl) {
    return (
      <span className={cn("relative block size-10 shrink-0 overflow-hidden rounded-full", className)}>
        <SmartImage src={brand.logoUrl} alt="" fill sizes="48px" className="object-contain" />
      </span>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={cn("size-10 shrink-0", className)} aria-hidden>
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="hsl(var(--gold))" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke="hsl(var(--gold) / 0.35)" strokeWidth="1" />
      <g stroke="hsl(var(--gold))" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M15 33 L31 15" />
        <path d="M31 15 l3.2 -1.4 -1.4 3.2" />
        <path d="M33 33 L17 15" opacity="0.55" />
      </g>
      <path d="M13.5 34.5 l4 -4 2 2 -4 4 z" fill="hsl(var(--gold))" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { brand } = useSettings();
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3 rounded-md", className)} aria-label={`${brand.name} — página inicial`}>
      <LogoMark className="transition-transform duration-300 ease-out group-hover:rotate-[-8deg]" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold uppercase tracking-wide">
            {brand.logoPrimary}{" "}
            {brand.logoSecondary && (
              <span className="font-serif text-lg font-medium normal-case italic text-primary">{brand.logoSecondary}</span>
            )}
          </span>
          {brand.logoTagline && (
            <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{brand.logoTagline}</span>
          )}
        </span>
      )}
    </Link>
  );
}
