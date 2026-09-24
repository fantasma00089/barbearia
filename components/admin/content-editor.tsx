"use client";

import { Field } from "@/components/forms/field";
import { ImageUpload, ListEditor, TextAreaField, TextField, selectClass } from "./form-kit";
import { SettingsSectionForm } from "./settings-section-form";
import type { SiteSettings } from "@/types/settings";

/** Erros de listas chegam como "faq.0.q" → mapeia para o item. */
const itemError = (errors: Record<string, string | undefined>, list: string, i: number, field: string) => errors[`${list}.${i}.${field}`];

export function ContentEditor({ settings }: { settings: SiteSettings }) {
  return (
    <SettingsSectionForm section="content" initial={settings.content} title="Textos e mídias da Home" description="Salve ao terminar. Listas vazias escondem a seção correspondente no site.">
      {({ value, set, errors }) => (
        <div className="space-y-10">
          <fieldset className="space-y-4">
            <legend className="mb-2 font-display text-lg uppercase">Topo (hero)</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="h-eyebrow" label="Rótulo acima do título" value={value.hero.eyebrow} onChange={(v) => set("hero", { ...value.hero, eyebrow: v })} error={errors["hero.eyebrow"]} placeholder="Porto Velho · Rondônia" />
              <TextField id="h-badge" label="Selo abaixo dos botões" value={value.hero.badge} onChange={(v) => set("hero", { ...value.hero, badge: v })} error={errors["hero.badge"]} />
              <TextField id="h-t1" label="Título — linha 1" required value={value.hero.titleLine1} onChange={(v) => set("hero", { ...value.hero, titleLine1: v })} error={errors["hero.titleLine1"]} />
              <TextField id="h-t2" label="Título — linha 2 (em destaque)" value={value.hero.titleLine2} onChange={(v) => set("hero", { ...value.hero, titleLine2: v })} error={errors["hero.titleLine2"]} />
            </div>
            <TextAreaField id="h-sub" label="Subtítulo" required value={value.hero.subtitle} onChange={(v) => set("hero", { ...value.hero, subtitle: v })} error={errors["hero.subtitle"]} maxLength={300} rows={3} />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 font-display text-lg uppercase">Chamada final</legend>
            <TextField id="f-title" label="Título" required value={value.finalCta.title} onChange={(v) => set("finalCta", { ...value.finalCta, title: v })} error={errors["finalCta.title"]} />
            <TextField id="f-desc" label="Descrição" value={value.finalCta.description} onChange={(v) => set("finalCta", { ...value.finalCta, description: v })} error={errors["finalCta.description"]} />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 font-display text-lg uppercase">Galeria</legend>
            <ListEditor
              items={value.gallery}
              onChange={(v) => set("gallery", v)}
              newItem={() => ({ src: "", title: "", category: "" })}
              addLabel="Adicionar foto"
              itemLabel={(g) => g.title || "Nova foto"}
              renderItem={(g, update, i) => (
                <div className="grid gap-4 md:grid-cols-[auto_1fr]">
                  <ImageUpload id={`g-img-${i}`} label="Imagem" aspect="aspect-square" value={g.src || null} onChange={(url) => update({ src: url ?? "" })} error={itemError(errors, "gallery", i, "src")} />
                  <div className="grid gap-4">
                    <TextField id={`g-title-${i}`} label="Legenda" required value={g.title} onChange={(v) => update({ title: v })} error={itemError(errors, "gallery", i, "title")} />
                    <TextField id={`g-cat-${i}`} label="Categoria" value={g.category} onChange={(v) => update({ category: v })} placeholder="Cabelo, Barba…" />
                  </div>
                </div>
              )}
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 font-display text-lg uppercase">Depoimentos</legend>
            <ListEditor
              items={value.testimonials}
              onChange={(v) => set("testimonials", v)}
              newItem={() => ({ name: "", detail: "", rating: 5, text: "" })}
              addLabel="Adicionar depoimento"
              itemLabel={(t) => t.name || "Novo depoimento"}
              renderItem={(t, update, i) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <TextField id={`t-name-${i}`} label="Nome" required value={t.name} onChange={(v) => update({ name: v })} error={itemError(errors, "testimonials", i, "name")} />
                    <TextField id={`t-detail-${i}`} label="Detalhe" value={t.detail} onChange={(v) => update({ detail: v })} placeholder="Cliente desde 2020" />
                    <Field id={`t-rating-${i}`} label="Nota">
                      {(p) => (
                        <select {...p} value={t.rating} onChange={(e) => update({ rating: Number(e.target.value) })} className={selectClass}>
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {"★".repeat(n)} ({n})
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>
                  <TextAreaField id={`t-text-${i}`} label="Texto" required value={t.text} onChange={(v) => update({ text: v })} error={itemError(errors, "testimonials", i, "text")} maxLength={400} rows={3} />
                </>
              )}
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 font-display text-lg uppercase">Perguntas frequentes</legend>
            <ListEditor
              items={value.faq}
              onChange={(v) => set("faq", v)}
              newItem={() => ({ q: "", a: "" })}
              addLabel="Adicionar pergunta"
              itemLabel={(f) => f.q || "Nova pergunta"}
              renderItem={(f, update, i) => (
                <>
                  <TextField id={`q-${i}`} label="Pergunta" required value={f.q} onChange={(v) => update({ q: v })} error={itemError(errors, "faq", i, "q")} />
                  <TextAreaField id={`a-${i}`} label="Resposta" required value={f.a} onChange={(v) => update({ a: v })} error={itemError(errors, "faq", i, "a")} maxLength={800} rows={3} />
                </>
              )}
            />
          </fieldset>
        </div>
      )}
    </SettingsSectionForm>
  );
}
