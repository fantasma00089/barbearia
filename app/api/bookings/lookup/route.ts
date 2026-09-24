import { lookupBooking } from "@/server/bookings";
import { clientIp, json, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { lookupBookingSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  rateLimit(`lookup:${clientIp(req)}`, 15, 10 * 60_000);
  const { code, phone } = lookupBookingSchema.parse(await readJson(req));
  return json({ booking: await lookupBooking(code, phone) });
});
