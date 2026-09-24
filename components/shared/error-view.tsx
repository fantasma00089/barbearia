"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { whatsappLink } from "@/lib/format";

export function ErrorView({ reset, digest }: { reset: () => void; digest?: string }) {
  return (
    <section className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center" role="alert">
      <p className="eyebrow mb-4">Ops!</p>
      <h1 className="text-4xl font-semibold uppercase sm:text-5xl">Algo saiu do alinhamento</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Tivemos um problema ao carregar esta página. Tente novamente — se persistir, fale com a gente pelo WhatsApp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={reset}>
          <RotateCcw aria-hidden /> Tentar novamente
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={whatsappLink("Olá! Tive um problema no site.")} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/">Início</Link>
        </Button>
      </div>
      {digest && <p className="mt-6 font-mono text-xs text-muted-foreground">Código do erro: {digest}</p>}
    </section>
  );
}
