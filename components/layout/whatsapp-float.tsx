"use client";

import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { useSettings } from "@/components/providers/settings-provider";
import { whatsappLink } from "@/lib/format";
import { DURATION, EASE_OUT } from "@/lib/motion";

const HIDDEN_ON = ["/agendar"];

/** Botão fixo de WhatsApp — apenas no mobile/tablet. */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const settings = useSettings();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <m.a
      href={whatsappLink(settings.contact.whatsapp, `Olá! Vim pelo site da ${settings.brand.shortName} e gostaria de mais informações.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.6 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#15803d] text-white shadow-[0_10px_30px_-8px_rgba(21,128,61,0.6)] ring-1 ring-white/10 transition-colors hover:bg-[#166534] lg:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <WhatsAppIcon className="size-7" />
    </m.a>
  );
}
