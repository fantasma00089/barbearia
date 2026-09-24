"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { AdminSection, ImageUpload, SaveMessage, TextAreaField, TextField, Toggle, selectClass, useSaver } from "./form-kit";
import { SettingsSectionForm } from "./settings-section-form";
import { changePasswordSchema } from "@/lib/validation/settings";
import { flattenFieldErrors } from "@/lib/validation/errors";
import { maskPhone } from "@/lib/format";
import type { SiteSettings } from "@/types/settings";

const NAV = [
  ["identidade", "Identidade"],
  ["contato", "Contato"],
  ["endereco", "Endereço e mapa"],
  ["numeros", "Números"],
  ["agendamento", "Agendamento"],
  ["legal", "Dados legais"],
  ["seguranca", "Senha do painel"],
] as const;

const num = (v: string) => (v === "" ? ("" as unknown as number) : Number(v.replace(",", ".")));

export function SettingsEditor({ settings }: { settings: SiteSettings }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
      <nav aria-label="Seções" className="hidden lg:block">
        <ul className="sticky top-24 space-y-1 text-sm">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-3xl space-y-6">
        <SettingsSectionForm id="identidade" section="brand" initial={settings.brand} title="Identidade" description="Nome, logo, textos de SEO e cor da marca.">
          {({ value, set, errors }) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField id="b-name" label="Nome completo" required value={value.name} onChange={(v) => set("name", v)} error={errors.name} hint="Usado em títulos, SEO e textos legais." />
                <TextField id="b-short" label="Nome curto" required value={value.shortName} onChange={(v) => set("shortName", v)} error={errors.shortName} hint="Usado em mensagens e no título das abas." />
                <TextField id="b-logo1" label="Logo — parte principal" required value={value.logoPrimary} onChange={(v) => set("logoPrimary", v)} error={errors.logoPrimary} />
                <TextField id="b-logo2" label="Logo — destaque (itálico)" value={value.logoSecondary} onChange={(v) => set("logoSecondary", v)} error={errors.logoSecondary} />
                <TextField id="b-logo3" label="Logo — linha de baixo" value={value.logoTagline} onChange={(v) => set("logoTagline", v)} error={errors.logoTagline} />
                <TextField id="b-slogan" label="Slogan" required value={value.slogan} onChange={(v) => set("slogan", v)} error={errors.slogan} />
              </div>
              <TextAreaField id="b-desc" label="Descrição (Google e redes sociais)" required value={value.description} onChange={(v) => set("description", v)} error={errors.description} maxLength={300} rows={3} />
              <div className="grid gap-6 sm:grid-cols-2">
                <ImageUpload id="b-logo" label="Logo em imagem (opcional)" aspect="aspect-square" allowRemove value={value.logoUrl} onChange={(url) => set("logoUrl", url)} error={errors.logoUrl} hint="Quadrada, fundo transparente (PNG/WebP). Sem imagem, usa o emblema padrão." />
                <div className="space-y-2">
                  <label htmlFor="b-color" className="text-sm font-medium">
                    Cor de destaque
                  </label>
                  <div className="flex items-center gap-3">
                    <input id="b-color" type="color" value={value.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-12 w-16 cursor-pointer rounded-lg border bg-transparent p-1" />
                    <Input aria-label="Cor em hexadecimal" value={value.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="w-32 font-mono" maxLength={7} />
                    <Button type="button" variant="ghost" size="sm" onClick={() => set("accentColor", "#d9a441")}>
                      Padrão
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Botões, destaques e ícones. O tom é ajustado para manter a leitura nos temas escuro e claro.</p>
                  {errors.accentColor && <p className="text-xs font-medium text-destructive">{errors.accentColor}</p>}
                </div>
              </div>
            </>
          )}
        </SettingsSectionForm>

        <SettingsSectionForm id="contato" section="contact" initial={settings.contact} title="Contato">
          {({ value, set, errors }) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="c-phone" label="Telefone" required value={value.phoneDisplay} onChange={(v) => set("phoneDisplay", v)} error={errors.phoneDisplay} placeholder="(69) 3222-0000" />
              <TextField
                id="c-wa"
                label="WhatsApp"
                required
                value={maskPhone(value.whatsapp.replace(/^55(?=\d{10,11}$)/, ""))}
                onChange={(v) => set("whatsapp", v.replace(/\D/g, ""))}
                error={errors.whatsapp}
                placeholder="(69) 99000-0000"
                hint="Recebe as mensagens do site e o botão flutuante."
              />
              <TextField id="c-email" label="E-mail" type="email" required value={value.email} onChange={(v) => set("email", v)} error={errors.email} />
              <TextField id="c-ig" label="Instagram" value={value.instagramHandle} onChange={(v) => set("instagramHandle", v)} error={errors.instagramHandle} placeholder="usuario (sem @)" hint="Deixe vazio para ocultar." />
            </div>
          )}
        </SettingsSectionForm>

        <SettingsSectionForm id="endereco" section="address" initial={settings.address} title="Endereço e mapa" description="Latitude e longitude: no Google Maps, clique com o botão direito no local e copie as coordenadas.">
          {({ value, set, errors }) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="a-street" label="Rua e número" required className="sm:col-span-2" value={value.street} onChange={(v) => set("street", v)} error={errors.street} />
              <TextField id="a-nb" label="Bairro" required value={value.neighborhood} onChange={(v) => set("neighborhood", v)} error={errors.neighborhood} />
              <TextField id="a-city" label="Cidade" required value={value.city} onChange={(v) => set("city", v)} error={errors.city} />
              <TextField id="a-state" label="Estado (sigla)" required value={value.state} onChange={(v) => set("state", v.toUpperCase())} error={errors.state} maxLength={2} />
              <TextField id="a-cep" label="CEP" required value={value.postalCode} onChange={(v) => set("postalCode", v)} error={errors.postalCode} />
              <TextField id="a-ref" label="Ponto de referência" className="sm:col-span-2" value={value.reference} onChange={(v) => set("reference", v)} error={errors.reference} />
              <TextField id="a-lat" label="Latitude" inputMode="decimal" value={String(value.lat)} onChange={(v) => set("lat", num(v))} error={errors.lat} />
              <TextField id="a-lng" label="Longitude" inputMode="decimal" value={String(value.lng)} onChange={(v) => set("lng", num(v))} error={errors.lng} />
            </div>
          )}
        </SettingsSectionForm>

        <SettingsSectionForm id="numeros" section="stats" initial={settings.stats} title="Números" description="Barra de prova social da Home e dados estruturados do Google.">
          {({ value, set, errors }) => (
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField id="s-rating" label="Nota média (0 a 5)" inputMode="decimal" value={String(value.rating)} onChange={(v) => set("rating", num(v))} error={errors.rating} />
              <TextField id="s-reviews" label="Nº de avaliações" inputMode="numeric" value={String(value.reviewsCount)} onChange={(v) => set("reviewsCount", num(v))} error={errors.reviewsCount} />
              <TextField id="s-clients" label="Clientes atendidos" inputMode="numeric" value={String(value.clientsServed)} onChange={(v) => set("clientsServed", num(v))} error={errors.clientsServed} />
              <TextField id="s-years" label="Anos de experiência" inputMode="numeric" value={String(value.yearsExperience)} onChange={(v) => set("yearsExperience", num(v))} error={errors.yearsExperience} />
              <TextField id="s-founded" label="Ano de fundação" inputMode="numeric" value={String(value.foundedYear)} onChange={(v) => set("foundedYear", num(v))} error={errors.foundedYear} />
            </div>
          )}
        </SettingsSectionForm>

        <SettingsSectionForm id="agendamento" section="booking" initial={settings.booking} title="Regras de agendamento" description="Valem imediatamente para novos agendamentos. Horários de funcionamento ficam em Horários.">
          {({ value, set, errors }) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="r-step" label="Grade de horários" error={errors.slotStepMinutes} hint="De quanto em quanto tempo os horários são oferecidos.">
                  {(p) => (
                    <select {...p} value={value.slotStepMinutes} onChange={(e) => set("slotStepMinutes", Number(e.target.value))} className={selectClass}>
                      {[5, 10, 15, 20, 30, 60].map((m) => (
                        <option key={m} value={m}>
                          A cada {m} minutos
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <TextField id="r-buffer" label="Intervalo entre atendimentos (min)" inputMode="numeric" value={String(value.bufferMinutes)} onChange={(v) => set("bufferMinutes", num(v))} error={errors.bufferMinutes} hint="Tempo livre antes e depois de cada cliente." />
                <TextField id="r-lead" label="Antecedência mínima (min)" inputMode="numeric" value={String(value.minLeadMinutes)} onChange={(v) => set("minLeadMinutes", num(v))} error={errors.minLeadMinutes} hint="Ex.: 60 = não agenda para daqui a menos de 1 hora." />
                <TextField id="r-max" label="Agenda aberta por (dias)" inputMode="numeric" value={String(value.maxAdvanceDays)} onChange={(v) => set("maxAdvanceDays", num(v))} error={errors.maxAdvanceDays} />
                <TextField id="r-cancel" label="Cancelamento online até (horas antes)" inputMode="numeric" value={String(value.cancelMinHours)} onChange={(v) => set("cancelMinHours", num(v))} error={errors.cancelMinHours} />
                <TextField id="r-late" label="Tolerância de atraso (min)" inputMode="numeric" value={String(value.lateToleranceMinutes)} onChange={(v) => set("lateToleranceMinutes", num(v))} error={errors.lateToleranceMinutes} />
              </div>
              <Toggle
                id="r-auto"
                label="Confirmar reservas automaticamente"
                description="Desligado: novas reservas ficam “Aguardando confirmação” até você confirmar na Agenda."
                checked={value.autoConfirm}
                onChange={(v) => set("autoConfirm", v)}
              />
            </>
          )}
        </SettingsSectionForm>

        <SettingsSectionForm id="legal" section="legal" initial={settings.legal} title="Dados legais" description="Usados no rodapé, nos Termos de Uso e na Política de Privacidade.">
          {({ value, set, errors }) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="l-company" label="Razão social" required className="sm:col-span-2" value={value.companyName} onChange={(v) => set("companyName", v)} error={errors.companyName} />
              <TextField id="l-cnpj" label="CNPJ" required value={value.cnpj} onChange={(v) => set("cnpj", v)} error={errors.cnpj} />
              <TextField id="l-email" label="E-mail de privacidade (LGPD)" type="email" required value={value.privacyEmail} onChange={(v) => set("privacyEmail", v)} error={errors.privacyEmail} />
              <TextField id="l-forum" label="Foro" required className="sm:col-span-2" value={value.forum} onChange={(v) => set("forum", v)} error={errors.forum} placeholder="Comarca de Porto Velho, Estado de Rondônia" />
              <TextField id="l-date" label="Última atualização dos termos" type="date" value={value.lastUpdated} onChange={(v) => set("lastUpdated", v)} error={errors.lastUpdated} />
            </div>
          )}
        </SettingsSectionForm>

        <PasswordForm />
      </div>
    </div>
  );
}

function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const { saving, message, errors, setErrors, setMessage, save } = useSaver();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = changePasswordSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(flattenFieldErrors(parsed.error));
      setMessage({ text: "Confira os campos destacados.", variant: "error" });
      return;
    }
    const res = await save("/api/admin/password", "POST", parsed.data, "Senha alterada. Outras sessões abertas foram encerradas.");
    if (res) setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <AdminSection
        id="seguranca"
        title="Senha do painel"
        description="A nova senha substitui a do arquivo .env. Quem estiver logado em outro aparelho precisará entrar de novo."
        footer={
          <>
            <Button type="submit" loading={saving}>
              {!saving && <KeyRound aria-hidden />} Alterar senha
            </Button>
            <SaveMessage message={message} />
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField id="p-current" label="Senha atual" type="password" value={form.currentPassword} onChange={(v) => setForm((f) => ({ ...f, currentPassword: v }))} error={errors.currentPassword} />
          <TextField id="p-new" label="Nova senha" type="password" value={form.newPassword} onChange={(v) => setForm((f) => ({ ...f, newPassword: v }))} error={errors.newPassword} hint="Mínimo 8 caracteres." />
          <TextField id="p-confirm" label="Confirmar nova senha" type="password" value={form.confirmPassword} onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))} error={errors.confirmPassword} />
        </div>
      </AdminSection>
    </form>
  );
}
