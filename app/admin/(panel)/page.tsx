import Link from "next/link";
import { BookingsBoard } from "@/components/admin/bookings-board";
import { listBarbersForAdmin } from "@/server/admin";
import { getAdminStats, listBookingsForAdmin } from "@/server/bookings";
import { adminBookingsQuerySchema } from "@/lib/validation";
import { todayStr } from "@/lib/time";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function AdminAgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const today = todayStr();
  const parsed = adminBookingsQuerySchema.safeParse({ date: sp.date || undefined, status: sp.status || undefined, barberId: sp.barberId || undefined });
  const filters = parsed.success ? parsed.data : { date: "proximas", status: "ACTIVE" as const, barberId: undefined };

  const [bookings, barbers, stats] = await Promise.all([listBookingsForAdmin(filters), listBarbersForAdmin(), getAdminStats()]);

  // Cartões clicáveis: cada um abre a lista já filtrada.
  const cards = [
    { label: "Hoje", value: stats.today, href: `/admin?date=${today}`, active: filters.date === today && filters.status === "ACTIVE" },
    { label: "Pendentes", value: stats.pending, href: "/admin?date=proximas&status=PENDING", active: filters.date === "proximas" && filters.status === "PENDING" },
    { label: "Pedidos de reagendamento", value: stats.reschedule, href: "/admin?date=todas&status=RESCHEDULE", active: filters.status === "RESCHEDULE" },
    { label: "Próximas (ativas)", value: stats.upcoming, href: "/admin", active: filters.date === "proximas" && filters.status === "ACTIVE" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold uppercase">Agenda</h1>
        <p className="text-sm text-muted-foreground">Confirme, conclua ou cancele reservas. Horários no fuso de Porto Velho.</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              aria-current={c.active ? "page" : undefined}
              className={cn(
                "block rounded-xl border bg-card p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/60",
                c.active && "border-primary",
              )}
            >
              <span className="block text-xs text-muted-foreground">{c.label}</span>
              <span className="block font-display text-3xl font-semibold text-primary">{c.value}</span>
            </Link>
          </li>
        ))}
      </ul>
      <BookingsBoard
        bookings={bookings}
        barbers={barbers}
        filters={{ date: filters.date, status: filters.status, barberId: filters.barberId ?? null }}
        today={today}
      />
    </div>
  );
}
