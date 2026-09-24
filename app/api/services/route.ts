import { getServices } from "@/server/catalog";
import { json, route } from "@/server/http";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/types";

export const dynamic = "force-dynamic";

export const GET = route(async (req: Request) => {
  const category = new URL(req.url).searchParams.get("category")?.toUpperCase();
  const services = await getServices();
  const filtered =
    category && (SERVICE_CATEGORIES as readonly string[]).includes(category)
      ? services.filter((s) => s.category === (category as ServiceCategory))
      : services;
  return json({ services: filtered });
});
