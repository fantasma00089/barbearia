import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { isAdminRequest } from "@/server/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // Defesa em profundidade (o middleware já protege a rota).
  if (!(await isAdminRequest())) redirect("/admin/login");
  return (
    <>
      <AdminNav />
      <main className="container py-8">{children}</main>
    </>
  );
}
