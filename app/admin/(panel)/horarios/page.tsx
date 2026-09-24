import { HoursEditor } from "@/components/admin/hours-editor";
import { businessConfig } from "@/config/business";
import { getBusinessHours } from "@/server/catalog";

export const dynamic = "force-dynamic";

export default async function AdminHoursPage() {
  const hours = await getBusinessHours();
  const { booking } = businessConfig;
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold uppercase">Horário de funcionamento</h1>
        <p className="text-sm text-muted-foreground">
          Define os horários oferecidos no agendamento. Regras fixas (em <code>config/business.ts</code>): intervalo entre atendimentos de{" "}
          {booking.bufferMinutes} min, grade de {booking.slotStepMinutes} min, antecedência mínima de {booking.minLeadMinutes} min e agenda
          aberta por {booking.maxAdvanceDays} dias.
        </p>
      </div>
      <HoursEditor initial={hours} />
    </div>
  );
}
