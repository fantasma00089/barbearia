import { getAvailableSlots } from "@/server/availability";
import { clientIp, json, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { ANY_BARBER } from "@/lib/constants";
import { availabilityQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const GET = route(async (req: Request) => {
  rateLimit(`availability:${clientIp(req)}`, 120, 60_000);
  const params = Object.fromEntries(new URL(req.url).searchParams);
  const q = availabilityQuerySchema.parse(params);
  const result = await getAvailableSlots(q.serviceId, q.barberId === ANY_BARBER ? null : q.barberId, q.date, {
    findNext: true,
  });
  return json(result, { headers: { "Cache-Control": "no-store" } });
});
