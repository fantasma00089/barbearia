"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { apiFetch, ApiError, firstFieldErrors } from "@/lib/api-client";
import { timeBlockSchema } from "@/lib/validation/admin";
import { flattenFieldErrors } from "@/lib/validation/errors";
import type { TimeBlockDTO } from "@/types";

const selectClass = "flex h-12 w-full rounded-lg border border-input bg-background px-3 text-sm";

export function BlocksManager({ blocks, barbers, today }: { blocks: TimeBlockDTO[]; barbers: { id: string; name: string }[]; today: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [form, setForm] = useState({ barberId: "", date: today, startTime: "12:00", endTime: "13:00", reason: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, barberId: form.barberId || null };
    const parsed = timeBlockSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(flattenFieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSaving(true);
    setMessage(null);
    try {
      const res = await apiFetch<{ conflicts: number }>("/api/admin/blocks", { method: "POST", json: payload });
      setMessage(
        res.conflicts
          ? { text: `Bloqueio criado. Atenção: ${res.conflicts} reserva(s) ativa(s) no período — verifique na agenda.`, variant: "info" }
          : { text: "Bloqueio criado. Esses horários não aparecem mais para clientes.", variant: "success" },
      );
      setForm((f) => ({ ...f, reason: "" }));
      startTransition(() => router.refresh());
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) setErrors(firstFieldErrors(err.fieldErrors));
      setMessage({ text: err instanceof Error ? err.message : "Falha ao salvar.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remover este bloqueio?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/api/admin/blocks/${id}`, { method: "DELETE" });
      startTransition(() => router.refresh());
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Falha ao remover.", variant: "error" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
      <form onSubmit={submit} noValidate className="h-fit space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-semibold uppercase">Novo bloqueio</h2>
        <Field id="b-barber" label="Quem">
          {(p) => (
            <select {...p} value={form.barberId} onChange={set("barberId")} className={selectClass}>
              <option value="">Toda a barbearia</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field id="b-date" label="Data" required error={errors.date}>
          {(p) => <Input {...p} type="date" min={today} value={form.date} onChange={set("date")} />}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field id="b-start" label="Início" required error={errors.startTime}>
            {(p) => <Input {...p} type="time" step={900} value={form.startTime} onChange={set("startTime")} />}
          </Field>
          <Field id="b-end" label="Fim" required error={errors.endTime}>
            {(p) => <Input {...p} type="time" step={900} value={form.endTime} onChange={set("endTime")} />}
          </Field>
        </div>
        <Field id="b-reason" label="Motivo" optional>
          {(p) => <Input {...p} maxLength={120} placeholder="Ex.: folga, curso, manutenção" value={form.reason} onChange={set("reason")} />}
        </Field>
        <Button type="submit" className="w-full" loading={saving}>
          {!saving && <Plus aria-hidden />} Bloquear horário
        </Button>
        <p className="text-xs text-muted-foreground">Para bloquear o dia inteiro, use o horário de abertura até o fechamento.</p>
      </form>

      <div className="space-y-4">
        <FormAlert message={message?.text} variant={message?.variant} />
        <h2 className="text-xl font-semibold uppercase">Próximos bloqueios</h2>
        {blocks.length === 0 ? (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Nenhum bloqueio agendado.</p>
        ) : (
          <ul className="space-y-3">
            {blocks.map((b) => (
              <li key={b.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
                <div className="flex-1">
                  <p className="font-medium capitalize">{b.dateLabel}</p>
                  <p className="text-sm text-muted-foreground">
                    {b.timeRange} · {b.barberName ?? "Toda a barbearia"}
                    {b.reason ? ` · ${b.reason}` : ""}
                  </p>
                </div>
                <Button variant="ghost" size="icon" aria-label="Remover bloqueio" loading={deleting === b.id} onClick={() => remove(b.id)}>
                  {deleting !== b.id && <Trash2 />}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
