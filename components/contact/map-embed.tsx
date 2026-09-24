"use client";

import { useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const { lat, lng } = siteConfig.address.geo;
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&hl=pt-BR&output=embed`;

/**
 * Mapa com "fachada": só carrega o Google Maps quando o visitante pede.
 * Melhora desempenho e evita enviar dados a terceiros sem interação (LGPD).
 */
export function MapEmbed({ className }: { className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-muted", className)}>
      {loaded ? (
        <iframe
          src={embedUrl}
          title={`Mapa: localização da ${siteConfig.name}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 400" aria-hidden>
            <rect width="600" height="400" fill="hsl(var(--muted))" />
            <g stroke="hsl(var(--foreground) / 0.08)" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d="M-20 120 L620 70" />
              <path d="M-20 290 L620 330" />
              <path d="M150 -20 L200 420" />
              <path d="M420 -20 L380 420" />
            </g>
            <g stroke="hsl(var(--foreground) / 0.05)" strokeWidth="6" fill="none">
              <path d="M-20 200 L620 200" />
              <path d="M290 -20 L300 420" />
              <path d="M520 -20 L560 420" />
              <path d="M60 -20 L40 420" />
            </g>
            <path d="M300 200 L380 160 L420 230" stroke="hsl(var(--gold) / 0.5)" strokeWidth="3" strokeDasharray="6 6" fill="none" />
          </svg>
          <div className="relative flex h-full min-h-[inherit] flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <MapPin className="size-7" aria-hidden />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.address.street} — {siteConfig.address.neighborhood}, {siteConfig.address.city}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button size="sm" onClick={() => setLoaded(true)}>
                Carregar mapa interativo
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
                  Como chegar <ExternalLink aria-hidden />
                </a>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground/80">O mapa é fornecido pelo Google Maps.</p>
          </div>
        </>
      )}
    </div>
  );
}
