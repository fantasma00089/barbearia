/**
 * Esqueceu a senha do painel? Este comando apaga a senha definida pelo painel
 * e volta a valer a ADMIN_PASSWORD do arquivo .env.
 * Uso: npm run admin:reset-password
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const { count } = await prisma.setting.deleteMany({ where: { key: "security" } });
await prisma.$disconnect();
console.log(
  count
    ? "✅ Senha do painel redefinida. Entre com a ADMIN_PASSWORD do arquivo .env."
    : "ℹ️  Nenhuma senha personalizada encontrada — já vale a ADMIN_PASSWORD do .env.",
);
