import Link from "next/link";
import { Pencil, Plus, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/form-kit";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatDuration, formatPrice } from "@/lib/format";
import { listServicesFull } from "@/server/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await listServicesFull();
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Serviços"
        description="Preços, durações e categorias. A duração define os horários oferecidos no agendamento. ★ = destaque na Home."
        actions={
          <Button asChild>
            <Link href="/admin/servicos/novo">
              <Plus aria-hidden /> Novo serviço
            </Link>
          </Button>
        }
      />
      {services.length === 0 && <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Nenhum serviço cadastrado.</p>}
      <ul className="space-y-2">
        {services.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:gap-4">
            <ReorderButtons url={`/api/admin/services/${s.id}/move`} first={i === 0} last={i === services.length - 1} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{s.name}</p>
                {s.featured && <Star className="size-4 fill-primary text-primary" aria-label="Destaque" />}
                <Badge variant="outline">{CATEGORY_LABELS[s.category]}</Badge>
                {!s.active && <Badge variant="destructive">Inativo</Badge>}
                {s.barberIds.length === 0 && <Badge variant="warning">Sem barbeiro</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatPrice(s.priceCents, s.priceFrom)} · {formatDuration(s.durationMin)} · {s.barberIds.length} barbeiro(s)
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/servicos/${s.id}`}>
                <Pencil aria-hidden /> Editar
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
