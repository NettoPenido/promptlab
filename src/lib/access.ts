import crypto from "crypto";
import { db } from "@/lib/db";

export const COOKIE_EMAIL = "pl_email";
export const COOKIE_SIG = "pl_sig";
export const COOKIE_DEVICE = "pl_device";
export const COOKIE_SESSION = "pl_session";

function getSecret() {
  const s = process.env.ACCESS_SECRET;
  return s && s.length >= 16 ? s : "CHANGE_ME_ACCESS_SECRET_32CHARS_MIN";
}

export function signEmail(email: string) {
  const h = crypto.createHmac("sha256", getSecret());
  h.update(email);
  return h.digest("hex");
}

function allowlistHas(email: string) {
  const list = (process.env.ACCESS_ALLOWLIST || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}

export async function hasAccessForEmail(email: string): Promise<boolean> {
  const clean = (email || "").trim().toLowerCase();
  if (!clean || !clean.includes("@")) return false;

  try {
    const row = await db.accessGrant.findUnique({ where: { email: clean } });
    if (row?.status === "ACTIVE") return true;
    if (row?.status === "INACTIVE") return false;
  } catch {
    // DB not ready yet, fallback allowlist
  }

  return allowlistHas(clean);
}

export function sessionTtlSeconds() {
  const raw = process.env.SESSION_TTL_SECONDS;
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n <= 0) return 60 * 60 * 24; // 24h default
  return Math.floor(n);
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function nowPlusSeconds(sec: number) {
  return new Date(Date.now() + sec * 1000);
}
