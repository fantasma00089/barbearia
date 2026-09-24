import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { footerLinks, legalLinks } from "@/config/content";
import { fullAddress, instagramUrl, phoneE164 } from "@/lib/site";
import { getSettings } from "@/server/settings";
import { whatsappLink } from "@/lib/format";
import { summarizeHours } from "@/lib/hours";
import { getBusinessHoursCached } from "@/server/catalog";

export async function Footer() {
  const [rawHours, s] = await Promise.all([getBusinessHoursCached(), getSettings()]);
  const hours = summarizeHours(rawHours);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-card/40 pb-24 lg:pb-0">
      <div className="divider-gold absolute inset-x-0 top-0" aria-hidden />
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{s.brand.slogan}</p>
          <div className="flex gap-2">
            {s.contact.instagramHandle && (
            <a
              href={instagramUrl(s)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label={`Instagram @${s.contact.instagramHandle}`}
            >
              <InstagramIcon className="size-5" />
            </a>
            )}
            <a
              href={whatsappLink(s.contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-primary">Navegação</h2>
          <ul className="space-y-2.5 text-sm">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-primary">Horário</h2>
          <ul className="space-y-2.5 text-sm">
            {hours.map((h) => (
              <li key={h.label} className="flex items-start gap-2 text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
                <span>
                  <span className="text-foreground">{h.label}</span> · {h.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <address className="not-italic">
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-primary">Contato</h2>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
              <span>{fullAddress(s)}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
              <a href={`tel:${phoneE164(s)}`} className="hover:text-foreground">
                {s.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
              <a href={`mailto:${s.contact.email}`} className="break-all hover:text-foreground">
                {s.contact.email}
              </a>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t">
        <div className="container flex flex-col gap-3 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {s.legal.companyName}. CNPJ {s.legal.cnpj}.
          </p>
          <ul className="flex gap-5">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="hover:text-foreground" prefetch={false}>
                Área restrita
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
