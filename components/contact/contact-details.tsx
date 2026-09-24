import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { fullAddress, siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/format";
import type { HoursGroup } from "@/lib/hours";

export function ContactDetails({ hours, showHours = true }: { hours: HoursGroup[]; showHours?: boolean }) {
  const { contact, address } = siteConfig;
  const rows = [
    { icon: MapPin, label: "Endereço", value: fullAddress, hint: address.reference },
    { icon: Phone, label: "Telefone", value: contact.phoneDisplay, href: `tel:${contact.phoneE164}` },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: contact.whatsappDisplay,
      href: whatsappLink(`Olá! Vim pelo site da ${siteConfig.shortName}.`),
      external: true,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: `@${contact.instagramHandle}`,
      href: contact.instagramUrl,
      external: true,
    },
    { icon: Mail, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <address className="not-italic">
      <dl className="divide-y rounded-xl border bg-card">
        {rows.map(({ icon: Icon, label, value, href, external, hint }) => (
          <div key={label} className="flex gap-4 p-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words text-[15px]">
                {href ? (
                  <a
                    href={href}
                    className="transition-colors hover:text-primary"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
                {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
              </dd>
            </div>
          </div>
        ))}
        {showHours && (
          <div className="flex gap-4 p-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="size-5" aria-hidden />
            </span>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Horário</dt>
              <dd className="mt-1 space-y-1 text-[15px]">
                {hours.map((h) => (
                  <span key={h.label} className="flex gap-2">
                    <span className="w-24 shrink-0 text-muted-foreground">{h.label}</span>
                    <span className={h.isOpen ? "" : "text-muted-foreground"}>{h.value}</span>
                  </span>
                ))}
              </dd>
            </div>
          </div>
        )}
      </dl>
    </address>
  );
}
