import { Award, Star, Users } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { homeContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { formatNumber } from "@/lib/format";

export function SocialProof() {
  const { stats } = siteConfig;
  const labels = homeContent.socialProof;
  const items = [
    {
      icon: Star,
      value: stats.rating.toFixed(1).replace(".", ","),
      label: `${labels.ratingLabel} · ${formatNumber(stats.reviewsCount)} ${labels.reviewsLabel}`,
    },
    { icon: Users, value: `${Math.floor(stats.clientsServed / 1000)} mil+`, label: labels.clientsLabel },
    { icon: Award, value: `${stats.yearsExperience}`, label: labels.yearsLabel },
  ];

  return (
    <section aria-label="Números da barbearia" className="border-y bg-card/50">
      <Stagger as="ul" className="container grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map(({ icon: Icon, value, label }) => (
          <StaggerItem as="li" key={label} className="flex items-center gap-4 py-6 sm:justify-center sm:px-6">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <p className="flex flex-col">
              <span className="font-display text-3xl font-semibold leading-none">{value}</span>
              <span className="mt-1 text-sm text-muted-foreground">{label}</span>
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
