import { notFound } from "next/navigation";
import { BarberForm } from "@/components/admin/barber-form";
import { getBarberFull, listServicesFull } from "@/server/admin-catalog";
import { getBusinessHours } from "@/server/catalog";

export const dynamic = "force-dynamic";

export default async function AdminBarberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [services, shopHours] = await Promise.all([listServicesFull(), getBusinessHours()]);
  const barber = id === "novo" ? null : await getBarberFull(id);
  if (id !== "novo" && !barber) notFound();
  return <BarberForm barber={barber} services={services} shopHours={shopHours} />;
}
