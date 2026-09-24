import { requireAdmin } from "@/server/auth/admin";
import { listBookingsForAdmin } from "@/server/bookings";
import { json, route } from "@/server/http";
import { adminBookingsQuerySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const GET = route(async (req: Request) => {
  await requireAdmin();
  const q = adminBookingsQuerySchema.parse(Object.fromEntries(new URL(req.url).searchParams));
  return json({ bookings: await listBookingsForAdmin(q) });
});
