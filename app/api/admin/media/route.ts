import { requireAdmin } from "@/server/auth/admin";
import { saveMedia } from "@/server/admin-catalog";
import { AppError } from "@/server/errors";
import { json, route } from "@/server/http";

export const dynamic = "force-dynamic";

export const POST = route(async (req: Request) => {
  await requireAdmin();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) throw new AppError("VALIDATION", "Nenhuma imagem enviada.");
  return json(await saveMedia(file), { status: 201 });
});
