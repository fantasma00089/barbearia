"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { apiFetch } from "@/lib/api-client";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setFieldError("Informe a senha.");
      return;
    }
    setFieldError(undefined);
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/admin/login", { method: "POST", json: { password } });
      const next = params.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {!configured && (
        <FormAlert
          variant="info"
          message="Painel desativado: defina ADMIN_PASSWORD e ADMIN_SESSION_SECRET no arquivo .env e reinicie o servidor."
        />
      )}
      <Field id="password" label="Senha" error={fieldError}>
        {(p) => (
          <Input {...p} type="password" autoComplete="current-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
        )}
      </Field>
      <FormAlert message={error} />
      <Button type="submit" className="w-full" loading={loading} disabled={!configured}>
        {!loading && <Lock aria-hidden />} Entrar
      </Button>
    </form>
  );
}
