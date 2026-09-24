"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Clock, ExternalLink, LogOut, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Agenda", icon: CalendarDays },
  { href: "/admin/bloqueios", label: "Bloqueios", icon: Ban },
  { href: "/admin/horarios", label: "Horários", icon: Clock },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Painel — início">
          <LogoMark className="size-8" />
          <span className="hidden font-display text-lg uppercase tracking-wide sm:inline">Painel</span>
        </Link>
        <nav aria-label="Painel" className="flex flex-1 gap-1 overflow-x-auto">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" title="Ver site">
            <Link href="/" target="_blank" aria-label="Ver site em nova aba">
              <ExternalLink />
            </Link>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair" title="Sair">
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
}
