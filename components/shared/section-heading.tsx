import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, description, align = "left", className, id, as: Tag = "h2" }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", align === "center" && "justify-center")}>{eyebrow}</p>}
      <Tag id={id} className="text-4xl font-semibold uppercase leading-[1.05] sm:text-5xl">
        {title}
      </Tag>
      {description && <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>}
    </Reveal>
  );
}
