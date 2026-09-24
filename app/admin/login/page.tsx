import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/shared/logo";
import { isAdminConfigured } from "@/server/auth/admin";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h1 className="text-2xl font-semibold uppercase">Área restrita</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Acesso exclusivo da equipe.</p>
          <Suspense>
            <LoginForm configured={isAdminConfigured()} />
          </Suspense>
        </div>
        <p className="text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </main>
  );
}
