import { requestReschedule } from "@/server/bookings";
import { clientIp, json, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { rescheduleRequestSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  rateLimit(`reschedule:${clientIp(req)}`, 10, 10 * 60_000);
  const input = rescheduleRequestSchema.parse(await readJson(req));
  return json({ booking: await requestReschedule(input) });
});
