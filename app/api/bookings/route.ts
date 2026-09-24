import { createBooking } from "@/server/bookings";
import { clientIp, json, readJson, route } from "@/server/http";
import { rateLimit } from "@/server/rate-limit";
import { AppError } from "@/server/errors";
import { createBookingSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  rateLimit(`booking:${clientIp(req)}`, 8, 10 * 60_000);
  const input = createBookingSchema.parse(await readJson(req));
  if (input.website) throw new AppError("VALIDATION", "Requisição inválida.");
  const booking = await createBooking(input);
  return json({ booking }, { status: 201 });
});
