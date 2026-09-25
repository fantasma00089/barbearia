import { afterEach, describe, expect, it, vi } from "vitest";
import {
  EXAMPLE_ADMIN_PASSWORD,
  EXAMPLE_SESSION_SECRET,
  getEnvAdminPassword,
  getSessionSecret,
  readSessionVersion,
  signSession,
  verifySession,
} from "@/lib/auth-token";

const SECRET = "x".repeat(40);

afterEach(() => vi.unstubAllEnvs());

describe("sessão do admin", () => {
  it("assina e valida o token", async () => {
    const token = await signSession(SECRET, 3);
    expect(await verifySession(token, SECRET)).toBe(true);
    expect(readSessionVersion(token)).toBe(3);
  });

  it("rejeita token adulterado, com outro segredo ou expirado", async () => {
    const token = await signSession(SECRET);
    const [payload, sig] = token.split(".");
    const forged = `${Buffer.from(JSON.stringify({ exp: Date.now() + 1e9, v: 99 })).toString("base64url")}.${sig}`;
    expect(await verifySession(forged, SECRET)).toBe(false);
    expect(await verifySession(`${payload}.AAAA`, SECRET)).toBe(false);
    expect(await verifySession(token, "y".repeat(40))).toBe(false);
    expect(await verifySession(token, SECRET, Date.now() + 9 * 3600_000)).toBe(false);
    expect(await verifySession(undefined, SECRET)).toBe(false);
    expect(await verifySession("lixo", SECRET)).toBe(false);
  });

  it("em produção não aceita segredo nem senha de exemplo", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_SESSION_SECRET", EXAMPLE_SESSION_SECRET);
    vi.stubEnv("ADMIN_PASSWORD", EXAMPLE_ADMIN_PASSWORD);
    expect(getSessionSecret()).toBeNull();
    expect(getEnvAdminPassword()).toBeNull();
  });

  it("em desenvolvimento aceita os valores de exemplo", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ADMIN_SESSION_SECRET", EXAMPLE_SESSION_SECRET);
    vi.stubEnv("ADMIN_PASSWORD", EXAMPLE_ADMIN_PASSWORD);
    expect(getSessionSecret()).toBe(EXAMPLE_SESSION_SECRET);
    expect(getEnvAdminPassword()).toBe(EXAMPLE_ADMIN_PASSWORD);
  });

  it("rejeita segredo curto e senha curta", () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "curto");
    vi.stubEnv("ADMIN_PASSWORD", "123");
    expect(getSessionSecret()).toBeNull();
    expect(getEnvAdminPassword()).toBeNull();
  });
});
