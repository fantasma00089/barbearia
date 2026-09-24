"use client";

import { Field } from "@/components/forms/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { maskPhone } from "@/lib/format";

export interface CustomerData {
  name: string;
  phone: string;
  notes: string;
}

export function CustomerStep({
  value,
  onChange,
  errors,
}: {
  value: CustomerData;
  onChange: (v: CustomerData) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="grid gap-5">
      <Field id="name" label="Nome completo" required error={errors.name}>
        {(p) => (
          <Input
            {...p}
            name="name"
            autoComplete="name"
            placeholder="Como devemos te chamar?"
            value={value.name}
            maxLength={80}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        )}
      </Field>
      <Field
        id="phone"
        label="WhatsApp"
        required
        error={errors.phone}
        hint="Usamos para confirmar o horário e para você consultar sua reserva."
      >
        {(p) => (
          <Input
            {...p}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(69) 99999-0000"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: maskPhone(e.target.value) })}
          />
        )}
      </Field>
      <Field id="notes" label="Observação" optional error={errors.notes} hint={`${value.notes.length}/300 caracteres`}>
        {(p) => (
          <Textarea
            {...p}
            name="notes"
            placeholder="Ex.: quero manter o comprimento em cima, é meu primeiro platinado…"
            value={value.notes}
            maxLength={300}
            onChange={(e) => onChange({ ...value, notes: e.target.value })}
          />
        )}
      </Field>
    </div>
  );
}
