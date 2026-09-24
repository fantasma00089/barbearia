"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/forms/form-alert";
import { AdminPageHeader, AdminSection, ImageUpload, SaveButton, SaveMessage, TextAreaField, TextField, Toggle, useSaver } from "./form-kit";
import { WeeklyHoursEditor } from "./weekly-hours-editor";
import { apiFetch } from "@/lib/api-client";
import { CATEGORY_LABELS } from "@/lib/constants";
import { barberInputSchema } from "@/lib/validation/catalog";
import { flattenFieldErrors } from "@/lib/validation/errors";
import type { AdminBarber, AdminService } from "@/server/admin-catalog";
import { SERVICE_CATEGORIES, type BusinessHourDTO } from "@/types";

export function BarberForm({ barber, services, shopHours }: { barber: AdminBarber | null; services: AdminService[]; shopHours: BusinessHourDTO[] }) {
  const router = useRouter();
  const { saving, message, errors, setErrors, setMessage, save } = useSaver();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: barber?.name ?? "",
    nickname: barber?.nickname ?? "",
    specialty: barber?.specialty ?? "",
    bio: barber?.bio ?? "",
    yearsExperience: String(barber?.yearsExperience ?? 1),
    rating: String(barber?.rating ?? 5),
    reviewsCount: String(barber?.reviewsCount ?? 0),
    photo: barber?.photo ?? "/images/barbers/placeholder.svg",
    instagram: barber?.instagram ?? "",
    active: barber?.active ?? true,
    serviceIds: barber?.serviceIds ?? [],
    customHours: barber?.customHours ?? [],
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleService = (id: string) =>
    set("serviceIds", form.serviceIds.includes(id) ? form.serviceIds.filter((x) => x !== id) : [...form.serviceIds, id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = barberInputSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(flattenFieldErrors(parsed.error));
      setMessage({ text: "Confira os campos destacados.", variant: "error" });
      return;
    }
    const res = await save<{ id: string }>(barber ? `/api/admin/barbers/${barber.id}` : "/api/admin/barbers", barber ? "PUT" : "POST", parsed.data, "Barbeiro salvo.");
    if (res) {
      router.push("/admin/barbeiros");
      router.refresh();
    }
  };

  const remove = async () => {
    if (!barber || !window.confirm(`Excluir ${barber.name}? Esta ação não pode ser desfeita.`)) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiFetch(`/api/admin/barbers/${barber.id}`, { method: "DELETE" });
      router.push("/admin/barbeiros");
      router.refresh();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Não foi possível excluir.");
      setDeleting(false);
    }
  };

  const hoursError = Object.entries(errors).find(([k]) => k.startsWith("customHours"))?.[1];

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-4xl space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/admin/barbeiros">
          <ArrowLeft aria-hidden /> Barbeiros
        </Link>
      </Button>
      <AdminPageHeader title={barber ? `Editar ${barber.name}` : "Novo barbeiro"} />

      <AdminSection title="Perfil" description="Aparece na página Equipe, na Home e no agendamento.">
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <ImageUpload id="photo" label="Foto" value={form.photo || null} onChange={(url) => set("photo", url ?? "")} error={errors.photo} hint="Retrato vertical (4:5), JPG ou WebP até 4 MB." />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="name" label="Nome" required value={form.name} onChange={(v) => set("name", v)} error={errors.name} maxLength={80} />
            <TextField id="nickname" label="Apelido" value={form.nickname} onChange={(v) => set("nickname", v)} error={errors.nickname} maxLength={30} placeholder="Ex.: Rafa" />
            <TextField id="specialty" label="Especialidade" required className="sm:col-span-2" value={form.specialty} onChange={(v) => set("specialty", v)} error={errors.specialty} maxLength={120} placeholder="Ex.: Fade, degradê e cortes clássicos" />
            <TextField id="instagram" label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} error={errors.instagram} placeholder="usuario (sem @)" />
            <TextField id="years" label="Anos de experiência" type="number" inputMode="numeric" value={form.yearsExperience} onChange={(v) => set("yearsExperience", v)} error={errors.yearsExperience} />
            <TextField id="rating" label="Nota (0 a 5)" type="number" inputMode="decimal" value={form.rating} onChange={(v) => set("rating", v)} error={errors.rating} />
            <TextField id="reviews" label="Nº de avaliações" type="number" inputMode="numeric" value={form.reviewsCount} onChange={(v) => set("reviewsCount", v)} error={errors.reviewsCount} />
          </div>
        </div>
        <TextAreaField id="bio" label="Bio" required value={form.bio} onChange={(v) => set("bio", v)} error={errors.bio} maxLength={600} rows={4} />
        <Toggle id="active" label="Ativo" description="Inativo = some do site e do agendamento, mas mantém o histórico." checked={form.active} onChange={(v) => set("active", v)} />
      </AdminSection>

      <AdminSection title="Serviços que atende" description="Só estes serviços poderão ser agendados com este barbeiro.">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground">Cadastre serviços primeiro.</p>
        ) : (
          SERVICE_CATEGORIES.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            if (!items.length) return null;
            return (
              <fieldset key={cat}>
                <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{CATEGORY_LABELS[cat]}</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((s) => (
                    <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input type="checkbox" checked={form.serviceIds.includes(s.id)} onChange={() => toggleService(s.id)} className="size-4 accent-[hsl(var(--primary))]" />
                      <span className="flex-1">{s.name}</span>
                      {!s.active && <span className="text-xs text-muted-foreground">(inativo)</span>}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })
        )}
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={() => set("serviceIds", services.map((s) => s.id))}>
            Marcar todos
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => set("serviceIds", [])}>
            Desmarcar todos
          </Button>
        </div>
        {errors.serviceIds && <p className="text-xs font-medium text-destructive">{errors.serviceIds}</p>}
      </AdminSection>

      <AdminSection title="Horário de trabalho" description="Por padrão segue o horário da barbearia. Defina horário próprio ou folga nos dias diferentes.">
        <WeeklyHoursEditor value={form.customHours} onChange={(v) => set("customHours", v)} shopHours={shopHours} error={hoursError} />
        <p className="text-xs text-muted-foreground">Para folgas pontuais (um dia específico), use Bloqueios.</p>
      </AdminSection>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-3 border-t bg-background/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border">
        <SaveButton saving={saving} label={barber ? "Salvar alterações" : "Cadastrar barbeiro"} />
        {barber && (
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
