"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { AdminPageHeader, AdminSection, SaveButton, SaveMessage, TextAreaField, TextField, Toggle, selectClass, useSaver } from "./form-kit";
import { apiFetch } from "@/lib/api-client";
import { CATEGORY_LABELS } from "@/lib/constants";
import { serviceInputSchema } from "@/lib/validation/catalog";
import { flattenFieldErrors } from "@/lib/validation/errors";
import type { AdminService } from "@/server/admin-catalog";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/types";

export function ServiceForm({ service, barbers }: { service: AdminService | null; barbers: { id: string; name: string; active: boolean }[] }) {
  const router = useRouter();
  const { saving, message, errors, setErrors, setMessage, save } = useSaver();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: service?.name ?? "",
    description: service?.description ?? "",
    category: (service?.category ?? "HAIR") as ServiceCategory,
    durationMin: String(service?.durationMin ?? 30),
    price: service ? (service.priceCents / 100).toFixed(2) : "",
    priceFrom: service?.priceFrom ?? false,
    featured: service?.featured ?? false,
    active: service?.active ?? true,
    barberIds: service?.barberIds ?? barbers.filter((b) => b.active).map((b) => b.id),
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = serviceInputSchema.safeParse({ ...form, price: form.price.replace(",", ".") });
    if (!parsed.success) {
      setErrors(flattenFieldErrors(parsed.error));
      setMessage({ text: "Confira os campos destacados.", variant: "error" });
      return;
    }
    const res = await save(service ? `/api/admin/services/${service.id}` : "/api/admin/services", service ? "PUT" : "POST", parsed.data, "Serviço salvo.");
    if (res) {
      router.push("/admin/servicos");
      router.refresh();
    }
  };

  const remove = async () => {
    if (!service || !window.confirm(`Excluir o serviço "${service.name}"?`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiFetch(`/api/admin/services/${service.id}`, { method: "DELETE" });
      router.push("/admin/servicos");
      router.refresh();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Não foi possível excluir.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-3xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/servicos">
          <ArrowLeft aria-hidden /> Serviços
        </Link>
      </Button>
      <AdminPageHeader title={service ? `Editar ${service.name}` : "Novo serviço"} />

      <AdminSection title="Dados do serviço">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="name" label="Nome" required className="sm:col-span-2" value={form.name} onChange={(v) => set("name", v)} error={errors.name} maxLength={80} />
          <Field id="category" label="Categoria" required error={errors.category}>
            {(p) => (
              <select {...p} value={form.category} onChange={(e) => set("category", e.target.value as ServiceCategory)} className={selectClass}>
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <TextField id="duration" label="Duração (minutos)" type="number" inputMode="numeric" required value={form.durationMin} onChange={(v) => set("durationMin", v)} error={errors.durationMin} hint="Define quanto tempo a agenda fica ocupada." />
          <TextField id="price" label="Preço (R$)" required inputMode="decimal" placeholder="45,00" value={form.price} onChange={(v) => set("price", v)} error={errors.price} />
        </div>
        <TextAreaField id="description" label="Descrição" required value={form.description} onChange={(v) => set("description", v)} error={errors.description} maxLength={300} rows={3} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Toggle id="priceFrom" label="“A partir de”" description="Preço pode variar." checked={form.priceFrom} onChange={(v) => set("priceFrom", v)} />
          <Toggle id="featured" label="Destaque" description="Aparece na Home." checked={form.featured} onChange={(v) => set("featured", v)} />
          <Toggle id="active" label="Ativo" description="Visível e agendável." checked={form.active} onChange={(v) => set("active", v)} />
        </div>
      </AdminSection>

      <AdminSection title="Quem realiza" description="Sem nenhum barbeiro marcado, o serviço aparece no site mas não pode ser agendado.">
        <div className="grid gap-2 sm:grid-cols-2">
          {barbers.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="checkbox"
                checked={form.barberIds.includes(b.id)}
                onChange={() => set("barberIds", form.barberIds.includes(b.id) ? form.barberIds.filter((x) => x !== b.id) : [...form.barberIds, b.id])}
                className="size-4 accent-[hsl(var(--primary))]"
              />
              <span className="flex-1">{b.name}</span>
              {!b.active && <span className="text-xs text-muted-foreground">(inativo)</span>}
            </label>
          ))}
        </div>
      </AdminSection>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t bg-background/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border">
        <SaveButton saving={saving} label={service ? "Salvar alterações" : "Cadastrar serviço"} />
        {service && (
          <Button type="button" variant="ghost" onClick={remove} loading={deleting} className="text-destructive hover:bg-destructive/10">
            {!deleting && <Trash2 aria-hidden />} Excluir
          </Button>
        )}
        <SaveMessage message={message} />
        <FormAlert message={deleteError} className="w-full" />
      </div>
    </form>
  );
}
