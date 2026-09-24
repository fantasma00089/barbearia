import { BookingsBoard } from "@/components/admin/bookings-board";
import { listBarbersForAdmin } from "@/server/admin";
import { getAdminStats, listBookingsForAdmin } from "@/server/bookings";
import { adminBookingsQuerySchema } from "@/lib/validation";
import { todayStr } from "@/lib/time";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function AdminAgendaPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const today = todayStr();
  const date = sp.date === "all" ? undefined : (sp.date ?? today);
  const parsed = adminBookingsQuerySchema.safeParse({ date, status: sp.status, barberId: sp.barberId || undefined });
  const filters = parsed.success ? parsed.data : { date: today, status: "ACTIVE" as const, barberId: undefined };

  const [bookings, barbers, stats] = await Promise.all([
    listBookingsForAdmin(filters),
    listBarbersForAdmin(),
    getAdminStats(),
  ]);

  const cards = [
    { label: "Hoje", value: stats.today },
    { label: "Pendentes", value: stats.pending },
    { label: "Pedidos de reagendamento", value: stats.reschedule },
    { label: "Próximas (ativas)", value: stats.upcoming },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold uppercase">Agenda</h1>
        <p className="text-sm text-muted-foreground">Confirme, conclua ou cancele reservas. Horários no fuso de Porto Velho.</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-4">
            <dt className="text-xs text-muted-foreground">{c.label}</dt>
            <dd className="font-display text-3xl font-semibold text-primary">{c.value}</dd>
          </div>
        ))}
      </dl>
      <BookingsBoard
        bookings={bookings}
        barbers={barbers}
        filters={{ date: filters.date ?? null, status: filters.status, barberId: filters.barberId ?? null }}
        today={today}
      />
    </div>
  );
}
