import Link from "next/link";
import { Clock, Pencil, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/form-kit";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/shared/smart-image";
import { listBarbersFull, listServicesFull } from "@/server/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminBarbersPage() {
  const [barbers, services] = await Promise.all([listBarbersFull(), listServicesFull()]);
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Barbeiros"
        description="Cadastre a equipe, defina fotos, serviços e horários próprios. A ordem aqui é a ordem exibida no site."
        actions={
          <Button asChild>
            <Link href="/admin/barbeiros/novo">
              <Plus aria-hidden /> Novo barbeiro
            </Link>
          </Button>
        }
      />
      {barbers.length === 0 && <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Nenhum barbeiro cadastrado.</p>}
      <ul className="space-y-3">
        {barbers.map((b, i) => (
          <li key={b.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:gap-4 sm:p-4">
            <ReorderButtons url={`/api/admin/barbers/${b.id}/move`} first={i === 0} last={i === barbers.length - 1} />
            <span className="relative size-14 shrink-0 overflow-hidden rounded-full border bg-muted">
              <SmartImage src={b.photo} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">
                  {b.name}
                  {b.nickname && <span className="font-normal text-muted-foreground"> · {b.nickname}</span>}
                </p>
                {!b.active && <Badge variant="destructive">Inativo</Badge>}
                {b.customHours.length > 0 && (
                  <Badge variant="outline">
                    <Clock className="size-3" aria-hidden /> Horário próprio
                  </Badge>
                )}
              </div>
              <p className="truncate text-sm text-muted-foreground">{b.specialty}</p>
              <p className="text-xs text-muted-foreground">
                {b.serviceIds.length} de {services.length} serviços · {b.bookingsCount} reserva(s) no histórico
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/barbeiros/${b.id}`}>
                <Pencil aria-hidden /> Editar
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
