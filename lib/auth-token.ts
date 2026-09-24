/**
 * Token de sessão do admin assinado com HMAC-SHA256 (Web Crypto).
 * Funciona tanto no runtime Node quanto no Edge (middleware).
 */
export const ADMIN_COOKIE = "na_admin";
export const ADMIN_SESSION_HOURS = 8;

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return secret.length >= 32 ? secret : null;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSession(secret: string, version = 0, now = Date.now()) {
  const payload = b64url(enc.encode(JSON.stringify({ exp: now + ADMIN_SESSION_HOURS * 3600_000, v: version })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), enc.encode(payload));
  return `${payload}.${b64url(sig)}`;
}

export async function verifySession(token: string | undefined, secret: string | null, now = Date.now()) {
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const ok = await crypto.subtle.verify("HMAC", await hmacKey(secret), fromB64url(sig), enc.encode(payload));
    if (!ok) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { exp: number };
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

/** Versão da sessão gravada no token (usada para invalidar sessões após troca de senha). */
export function readSessionVersion(token: string | undefined) {
  try {
    const payload = token?.split(".")[0];
    if (!payload) return -1;
    const { v } = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { v?: number };
    return typeof v === "number" ? v : 0;
  } catch {
    return -1;
  }
}
