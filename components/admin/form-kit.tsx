"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { SmartImage } from "@/components/shared/smart-image";
import { ApiError, apiFetch, firstFieldErrors } from "@/lib/api-client";
import { cn } from "@/lib/utils";

/* ───────── Estrutura ───────── */

export function AdminSection({
  id,
  title,
  description,
  children,
  footer,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border bg-card" aria-labelledby={id ? `${id}-title` : undefined}>
      <header className="border-b p-5 sm:p-6">
        <h2 id={id ? `${id}-title` : undefined} className="text-xl font-semibold uppercase">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </header>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
      {footer && <footer className="flex flex-wrap items-center gap-3 border-t p-5 sm:px-6">{footer}</footer>}
    </section>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-semibold uppercase">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* ───────── Campos ───────── */

type Errors = Record<string, string | undefined>;

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
  type = "text",
  placeholder,
  maxLength,
  className,
  inputMode,
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required} className={className}>
      {(p) => (
        <Input
          {...p}
          type={type}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          step={type === "number" ? "any" : undefined}
        />
      )}
    </Field>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required,
  maxLength,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}) {
  return (
    <Field id={id} label={label} error={error} hint={hint ?? (maxLength ? `${value.length}/${maxLength}` : undefined)} required={required}>
      {(p) => <Textarea {...p} value={value} maxLength={maxLength} rows={rows} onChange={(e) => onChange(e.target.value)} />}
    </Field>
  );
}

/** Interruptor acessível (checkbox nativo estilizado). */
export function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-muted ring-1 ring-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-foreground/80 shadow transition-transform duration-200 peer-checked:translate-x-5 peer-checked:bg-primary-foreground" />
      </span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}

export const selectClass =
  "flex h-12 w-full rounded-lg border border-input bg-background/60 px-3 text-sm transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15";

/* ───────── Upload de imagem ───────── */

export function ImageUpload({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  aspect = "aspect-[4/5]",
  allowRemove = false,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string;
  hint?: string;
  aspect?: string;
  allowRemove?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await apiFetch<{ url: string }>("/api/admin/media", { method: "POST", body });
      onChange(res.url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Falha no envio.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-start gap-4">
        <div className={cn("relative w-28 shrink-0 overflow-hidden rounded-lg border bg-muted", aspect)}>
          {value ? (
            <SmartImage src={value} alt="" fill sizes="112px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <ImagePlus className="size-6" aria-hidden />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-5 animate-spin" aria-hidden />
            </span>
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()} loading={uploading}>
              {!uploading && <ImagePlus aria-hidden />} {value ? "Trocar imagem" : "Enviar imagem"}
            </Button>
            {allowRemove && value && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
                Remover
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{hint ?? "JPG, PNG ou WebP até 4 MB."}</p>
          {(uploadError || error) && <p className="text-xs font-medium text-destructive">{uploadError ?? error}</p>}
        </div>
      </div>
    </div>
  );
}

/* ───────── Editor de listas ───────── */

export function ListEditor<T>({
  items,
  onChange,
  newItem,
  addLabel,
  renderItem,
  itemLabel,
  max = 40,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  itemLabel: (item: T, index: number) => string;
  max?: number;
}) {
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Nenhum item. A seção fica oculta no site.</p>}
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold">
              {i + 1}. {itemLabel(item, i)}
            </p>
            <div className="flex shrink-0 gap-1">
              <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Mover para cima">
                <ArrowUp />
              </Button>
              <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Mover para baixo">
                <ArrowDown />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-destructive hover:bg-destructive/10"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label="Remover item"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          <div className="space-y-4">{renderItem(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))), i)}</div>
        </div>
      ))}
      {items.length < max && (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, newItem()])}>
          <Plus aria-hidden /> {addLabel}
        </Button>
      )}
    </div>
  );
}

/* ───────── Salvar ───────── */

/** Hook de salvamento com mensagens e erros por campo. */
export function useSaver() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; variant: "success" | "error" } | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const save = async <T,>(url: string, method: "POST" | "PUT", body: unknown, okText = "Alterações salvas."): Promise<T | null> => {
    setSaving(true);
    setMessage(null);
    setErrors({});
    try {
      const res = await apiFetch<T>(url, { method, json: body });
      setMessage({ text: okText, variant: "success" });
      return res;
    } catch (e) {
      if (e instanceof ApiError && e.fieldErrors) setErrors(firstFieldErrors(e.fieldErrors));
      setMessage({ text: e instanceof Error ? e.message : "Não foi possível salvar.", variant: "error" });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { saving, message, errors, setErrors, setMessage, save };
}

export function SaveButton({ saving, label = "Salvar" }: { saving: boolean; label?: string }) {
  return (
    <Button type="submit" loading={saving}>
      {!saving && <Save aria-hidden />} {label}
    </Button>
  );
}

export function SaveMessage({ message }: { message: { text: string; variant: "success" | "error" } | null }) {
  return <FormAlert message={message?.text} variant={message?.variant} className="w-full" />;
}
