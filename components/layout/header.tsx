"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { navigation } from "@/config/content";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/brand-icons";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[background-color,border-color] duration-300",
        scrolled ? "border-border/80 bg-background/85 backdrop-blur-md" : "border-transparent bg-background/0",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6 md:h-20">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link"
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/agendar">
              <CalendarCheck aria-hidden />
              Agendar
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu className="!size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Navegação principal do site</SheetDescription>
              <Logo className="mb-10" />
              <nav aria-label="Menu móvel">
                <ul className="flex flex-col gap-1">
                  {[...navigation, { href: "/agendar", label: "Agendar horário" }].map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          aria-current={isActive(pathname, item.href) ? "page" : undefined}
                          className="flex items-center justify-between rounded-lg px-3 py-3 font-display text-2xl uppercase tracking-wide text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:text-primary"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Button asChild size="lg">
                  <Link href="/agendar">Agendar agora</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={whatsappLink(`Olá! Vim pelo site da ${siteConfig.shortName}.`)} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> WhatsApp
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
