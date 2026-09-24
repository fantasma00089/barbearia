"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/format";
import { contactMessageSchema } from "@/lib/validation/booking";
import { flattenFieldErrors } from "@/lib/validation/errors";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  { value: "agendamento", label: "Agendamento" },
  { value: "duvida", label: "Dúvida" },
  { value: "evento", label: "Evento / Dia do noivo" },
  { value: "parceria", label: "Parceria" },
  { value: "outro", label: "Outro" },
] as const;

/**
 * Formulário de contato sem backend: valida com Zod e abre o WhatsApp
 * com a mensagem pronta. Nenhum dado é armazenado no servidor.
 */
export function WhatsAppForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]["value"]>("agendamento");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactMessageSchema.safeParse({ name, subject, message });
    if (!parsed.success) {
      const fe = flattenFieldErrors(parsed.error);
      setErrors(fe);
      document.getElementById(`contact-${Object.keys(fe)[0]}`)?.focus();
      return;
    }
    setErrors({});
    const label = SUBJECTS.find((s) => s.value === subject)!.label;
    const text = `Olá, ${siteConfig.shortName}! Sou ${parsed.data.name}.\nAssunto: ${label}\n\n${parsed.data.message}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSent("Abrimos o WhatsApp com sua mensagem. É só tocar em enviar!");
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border bg-card p-6" aria-labelledby="contact-form-title">
      <div>
        <h2 id="contact-form-title" className="text-2xl font-semibold uppercase">
          Mande uma mensagem
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Preencha e enviaremos você direto para o nosso WhatsApp.</p>
      </div>
      <Field id="contact-name" label="Seu nome" required error={errors.name}>
        {(p) => <Input {...p} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />}
      </Field>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Assunto</legend>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <label key={s.value} className="cursor-pointer">
              <input
                type="radio"
                name="subject"
                value={s.value}
                checked={subject === s.value}
                onChange={() => setSubject(s.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex rounded-full border px-3 py-1.5 text-sm transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                  subject === s.value ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:border-primary/60 hover:text-foreground",
                )}
              >
                {s.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field id="contact-message" label="Mensagem" required error={errors.message} hint={`${message.length}/600`}>
        {(p) => <Textarea {...p} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={600} />}
      </Field>
      <FormAlert message={sent} variant="success" />
      <Button type="submit" className="w-full sm:w-auto">
        <Send aria-hidden /> Continuar no WhatsApp
      </Button>
    </form>
  );
}
