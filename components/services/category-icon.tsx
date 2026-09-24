import { Layers, Palette, Scissors, Smile } from "lucide-react";
import { RazorIcon } from "@/components/icons/brand-icons";
import type { ServiceCategory } from "@/types";

const ICONS = { HAIR: Scissors, BEARD: RazorIcon, COMBO: Layers, CHEMICAL: Palette, KIDS: Smile } as const;

export function CategoryIcon({ category, className }: { category: ServiceCategory; className?: string }) {
  const Icon = ICONS[category];
  return <Icon className={className} aria-hidden />;
}
