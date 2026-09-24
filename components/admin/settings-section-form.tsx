"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSection, SaveButton, SaveMessage, useSaver } from "./form-kit";
import { settingsSectionSchemas, type SettingsSection } from "@/lib/validation/settings";
import { flattenFieldErrors } from "@/lib/validation/errors";
import type { SiteSettings } from "@/types/settings";

type Errors = Record<string, string | undefined>;

/** Formulário de uma seção das configurações: estado local, validação Zod e salvamento. */
export function SettingsSectionForm<K extends SettingsSection>({
  section,
  initial,
  title,
  description,
  id,
  children,
}: {
  section: K;
  initial: SiteSettings[K];
  title: string;
  description?: string;
  id?: string;
  children: (state: {
    value: SiteSettings[K];
    set: <F extends keyof SiteSettings[K]>(field: F, v: SiteSettings[K][F]) => void;
    replace: (v: SiteSettings[K]) => void;
    errors: Errors;
  }) => React.ReactNode;
}) {
  const router = useRouter();
  const [value, setValue] = useState<SiteSettings[K]>(initial);
  const { saving, message, errors, setErrors, setMessage, save } = useSaver();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = settingsSectionSchemas[section].safeParse(value);
    if (!parsed.success) {
      setErrors(flattenFieldErrors(parsed.error));
      setMessage({ text: "Confira os campos destacados.", variant: "error" });
      return;
    }
    const res = await save("/api/admin/settings", "PUT", { section, data: parsed.data }, "Salvo! O site já foi atualizado.");
    if (res) router.refresh();
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <AdminSection
        id={id}
        title={title}
        description={description}
        footer={
          <>
            <SaveButton saving={saving} />
            <SaveMessage message={message} />
          </>
        }
      >
        {children({
          value,
          set: (field, v) => setValue((cur) => ({ ...cur, [field]: v })),
          replace: setValue,
          errors,
        })}
      </AdminSection>
    </form>
  );
}
