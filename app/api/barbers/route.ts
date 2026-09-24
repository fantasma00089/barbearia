import { getBarbers } from "@/server/catalog";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

export const GET = route(async (req: Request) => {
  const serviceId = new URL(req.url).searchParams.get("serviceId");
  const barbers = await getBarbers();
  return json({ barbers: serviceId ? barbers.filter((b) => b.serviceIds.includes(serviceId)) : barbers });
});
