/**
 * Configuração inicial multiplataforma (Windows, macOS, Linux):
 *  1. cria o .env a partir do .env.example (se ainda não existir);
 *  2. gera o Prisma Client (necessário quando o npm bloqueia scripts de instalação);
 *  3. aplica as migrations e popula o banco.
 * Uso: npm run setup
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log(`\n› ${cmd}`);
  execSync(cmd, { stdio: "inherit", shell: true });
};

if (!existsSync(".env")) {
  // Gera um segredo de sessão exclusivo desta instalação.
  const secret = randomBytes(48).toString("base64url");
  const env = readFileSync(".env.example", "utf8").replace(
    /^ADMIN_SESSION_SECRET=.*$/m,
    `ADMIN_SESSION_SECRET="${secret}"`,
  );
  writeFileSync(".env", env);
  console.log("✓ .env criado com segredo de sessão aleatório (troque ADMIN_PASSWORD antes de publicar)");
} else {
  const env = readFileSync(".env", "utf8");
  if (env.includes("troque-por-um-segredo-longo")) {
    console.log("⚠ .env usa o ADMIN_SESSION_SECRET de exemplo: em produção o painel fica bloqueado até você trocá-lo.");
  } else console.log("✓ .env já existe — mantido");
}

run("npx prisma generate");
run("npx prisma migrate deploy");
run("npx prisma db seed");

console.log("\n✅ Pronto! Rode `npm run dev` e abra http://localhost:3000");
