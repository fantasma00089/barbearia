import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/service-form";
import { getServiceFull, listBarbersFull } from "@/server/admin-catalog";

export const dynamic = "force-dynamic";

export default async function AdminServiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const barbers = await listBarbersFull();
  const service = id === "novo" ? null : await getServiceFull(id);
  if (id !== "novo" && !service) notFound();
  return <ServiceForm service={service} barbers={barbers.map((b) => ({ id: b.id, name: b.name, active: b.active }))} />;
}
