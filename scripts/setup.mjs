/**
 * Configuração inicial multiplataforma (Windows, macOS, Linux):
 *  1. cria o .env a partir do .env.example (se ainda não existir);
 *  2. gera o Prisma Client (necessário quando o npm bloqueia scripts de instalação);
 *  3. aplica as migrations e popula o banco.
 * Uso: npm run setup
 */
import { copyFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log(`\n› ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
};

if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("✓ .env criado a partir do .env.example (troque ADMIN_PASSWORD antes de publicar)");
} else {
  console.log("✓ .env já existe — mantido");
}

run("npx prisma generate");
run("npx prisma migrate deploy");
run("npx prisma db seed");

console.log("\n✅ Pronto! Rode `npm run dev` e abra http://localhost:3000");
