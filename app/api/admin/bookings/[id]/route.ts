import { requireAdmin } from "@/server/auth/admin";
import { adminUpdateBooking } from "@/server/bookings";
import { json, readJson, route } from "@/server/http";
import { adminBookingActionSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const PATCH = route(async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
  await requireAdmin();
  const { id } = await ctx.params;
  const { action, reason } = adminBookingActionSchema.parse(await readJson(req));
  return json({ booking: await adminUpdateBooking(id, action, reason) });
});
