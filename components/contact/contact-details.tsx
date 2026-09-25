import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { whatsappLink } from "@/lib/format";
import type { HoursGroup } from "@/lib/hours";
import { fullAddress, instagramUrl, phoneE164, whatsappDisplay } from "@/lib/site";
import type { SiteSettings } from "@/types/settings";

export function ContactDetails({
  settings,
  hours,
  showHours = true,
}: {
  settings: SiteSettings;
  hours: HoursGroup[];
  showHours?: boolean;
}) {
  const { contact, address } = settings;
  const allRows = [
    { icon: MapPin, label: "Endereço", value: fullAddress(settings), hint: address.reference },
    { icon: Phone, label: "Telefone", value: contact.phoneDisplay, href: `tel:${phoneE164(settings)}` },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: whatsappDisplay(settings),
      href: whatsappLink(contact.whatsapp, `Olá! Vim pelo site da ${settings.brand.shortName}.`),
      external: true,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: `@${contact.instagramHandle}`,
      href: instagramUrl(settings),
      external: true,
    },
    { icon: Mail, label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
  ];

  const rows = allRows.filter((r) => r.label !== "Instagram" || contact.instagramHandle);

  return (
    <address className="not-italic">
      <ul className="divide-y rounded-xl border bg-card">
        {rows.map(({ icon: Icon, label, value, href, external, hint }) => (
          <li key={label} className="flex gap-4 p-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
              <div className="mt-1 break-words text-[15px]">
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
              </div>
            </div>
          </li>
        ))}
        {showHours && (
          <li className="flex gap-4 p-5">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Horário</p>
              <div className="mt-1 space-y-1 text-[15px]">
                {hours.map((h) => (
                  <span key={h.label} className="flex gap-2">
                    <span className="w-24 shrink-0 text-muted-foreground">{h.label}</span>
                    <span className={h.isOpen ? "" : "text-muted-foreground"}>{h.value}</span>
                  </span>
                ))}
              </div>
            </div>
          </li>
        )}
      </ul>
    </address>
  );
}
