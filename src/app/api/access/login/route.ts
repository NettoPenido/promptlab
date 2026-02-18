import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signAccessToken } from "@/lib/auth-token";

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const grant = await db.accessGrant.findUnique({ where: { email: normalized } });
  if (!grant || grant.status !== "ACTIVE") {
    return NextResponse.json({ ok: false, error: "no_access" }, { status: 403 });
  }

  const token = signAccessToken(normalized, 60 * 60 * 24 * 30); // 30 days

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "promptlab_token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
