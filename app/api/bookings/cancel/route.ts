import { cancelBookingByCustomer } from "@/server/bookings";
import { clientIp, json, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { cancelBookingSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  rateLimit(`cancel:${clientIp(req)}`, 10, 10 * 60_000);
  const { code, phone, reason } = cancelBookingSchema.parse(await readJson(req));
  return json({ booking: await cancelBookingByCustomer(code, phone, reason) });
});
